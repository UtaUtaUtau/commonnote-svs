var SCRIPT_TITLE = "commonnote Paste (at playhead)";

function getClientInfo() {
    return {
        "name": SV.T(SCRIPT_TITLE),
        "author": "UtaUtaUtau",
        "category": "commonnote",
        "version": 1.0,
        "minEditorVersion": 65537
    }
}

function getTranslations(langCode) {
    if (langCode == "ja-jp") { // thank you to Xero for translation help!
        return [
            [SCRIPT_TITLE, "commonnote貼り付け (再生位置に直接)"],
            ["Cannot parse JSON.", "JSONをパースできません。"],
            ["Invalid data.", "データが無効です。"],
            ["Invalid identifier.", "識別子が無効です。"],
            ["No notes in data.", "データにノートはありません。"],
            ["Pasting out of group bounds. Continue?", "グループ外への貼り付け、続ける？"]
        ];
    }
    if (langCode == "fr-fr") { // thank you UTAU France for translation help!
        return [
            [SCRIPT_TITLE, "Coller commonnote (à la position du curseur)"],
            ["Cannot parse JSON.", "Lecture du JSON impossible."],
            ["Invalid data.", "Données invalidées."],
            ["Invalid identifier.", "Identifiant invalide."],
            ["No notes in data.", "Aucune note trouvée."],
            ["Pasting out of group bounds. Continue?", "La copie est en dehors des limites du groupe. Voulez-vous continuer ?"]
        ];
    }
    return [];
}

function messageBox(message) {
    SV.showMessageBox(SV.T(SCRIPT_TITLE), SV.T(message));
}

function throwCommonNoteError(message) {
    var error = new Error(message);
    error.name = "CommonNoteError";
    throw error;
}

function main() {
    try {
        var data = JSON.parse(SV.getHostClipboard()); // attempt to parse clipboard

        if (!data.identifier) { // check for invalid commonnote data
            throwCommonNoteError("Invalid data.");
        }

        if (data.identifier != "commonnote") { // check for invalid identifier
            throwCommonNoteError("Invalid identifier.");
        }

        if (data.notes.length == 0) { // check if there are no notes
            throwCommonNoteError("No notes in data.");
        }

        var fromSV = data.header.origin == "synthesizer-v-studio"; // if from synthv
        var resolutionFactor = SV.QUARTER / data.header.resolution; // for converting resolutions
        var dataStart = Infinity;
        var dataEnd = -Infinity;
        for (var i in data.notes) {
            var note = data.notes[i];
            dataStart = Math.min(dataStart, note.start);
            dataEnd = Math.max(dataEnd, note.start + note.length);
        }

        var group = SV.getMainEditor().getCurrentGroup(); // current group ref
        var target = group.getTarget(); // current group
        var timeAxis = SV.getProject().getTimeAxis(); // for converting playhead time to blicks
        var coords = SV.getMainEditor().getNavigation(); // for snapping playhead

        // playhead position relative to group snapped to grid in blicks
        var playheadPos = coords.snap(timeAxis.getBlickFromSeconds(SV.getPlayback().getPlayhead())) - group.getOnset();
        var pasteEnd = (dataEnd - dataStart) * resolutionFactor + playheadPos;
        var doPaste = true;
        if ((playheadPos < 0 || pasteEnd > group.getDuration()) && !group.isMain()) {
            doPaste = SV.showOkCancelBox(SV.T(SCRIPT_TITLE), SV.T("Pasting out of group bounds. Continue?"));
        }

        if (doPaste) {
            for (var i in data.notes) { // add notes to group
                var noteData = data.notes[i];

                // convert note data to SV note
                var note = SV.create("Note");
                note.setOnset((noteData.start - dataStart) * resolutionFactor + playheadPos);
                note.setDuration(noteData.length * resolutionFactor);
                note.setLyrics(noteData.label);
                note.setPitch(noteData.pitch);
                // sv specific data
                if (fromSV) {
                    note.setPhonemes(noteData.extra.phonemes);
                    note.setAttributes(noteData.extra.attributes);
                }

                target.addNote(note);
            }
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            messageBox("Cannot parse JSON.");
        } else if (error.name == "CommonNoteError") {
            messageBox(error.message);
        } else {
            messageBox("error: " + error.message);
        }
    } finally {
        SV.finish();
    }
}