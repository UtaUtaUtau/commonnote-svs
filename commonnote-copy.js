var SCRIPT_TITLE = "commonnote Copy";

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
            [SCRIPT_TITLE, "commonnoteコピー"],
            ["No content is selected.", "コンテンツが選択されていません。"]
        ];
    }
    if (langCode == "fr-fr") { // thank you Mim for translation help!
        return [
            [SCRIPT_TITLE, "Copier commonnote"],
            ["No content is selected.", "Aucun contenu sélectionné."]
        ];
    }
    return [];
}

function messageBox(message) {
    SV.showMessageBox(SV.T(SCRIPT_TITLE), SV.T(message));
}

function main() {
    try {
        // data scaffolding
        var data = {
            "identifier": "commonnote",
            "header": {
                "resolution": SV.QUARTER,
                "origin": "synthesizer-v-studio",
                "extra": {}
            },
            "notes": [],
            "extra": {
                "groups": []
            }
        }

        var selection = SV.getMainEditor().getSelection(); // get selection
        if (selection.hasSelectedContent()) { // if notes or groups selected
            // get selection
            var selectedNotes = selection.getSelectedNotes();
            var selectedGroups = selection.getSelectedGroups();



            for (var i in selectedNotes) { // push notes to notes array
                var note = selectedNotes[i];
                data.notes.push({
                    "start": note.getOnset(),
                    "length": note.getDuration(),
                    "label": note.getLyrics(),
                    "pitch": note.getPitch(),
                    "extra": note.getAttributes()
                });
            }

            for (var i in selectedGroups) { // push groups to notes array and extra data
                // group scaffolding
                var group = selectedGroups[i];
                var target = group.getTarget();
                var onset = group.getOnset();
                var pitchOffset = group.getPitchOffset();
                var groupData = {
                    "name": target.getName(),
                    "start": onset,
                    "pitchOffset": pitchOffset,
                    "notes": []
                }

                // get notes in group
                var numNotes = target.getNumNotes();
                for (var j = 0; j < numNotes; j++) {
                    var note = target.getNote(j);

                    data.notes.push({
                        "start": note.getOnset() + onset,
                        "length": note.getDuration(),
                        "label": note.getLyrics(),
                        "pitch": note.getPitch() + pitchOffset,
                        "extra": note.getAttributes()
                    }); // push notes with proper offsets to notes array

                    groupData.notes.push({
                        "start": note.getOnset(),
                        "length": note.getDuration(),
                        "label": note.getLyrics(),
                        "pitch": note.getPitch(),
                        "extra": note.getAttributes()
                    }); // push notes to group data
                }

                data.extra.groups.push(groupData); // push note data to extra
            }

            SV.setHostClipboard(JSON.stringify(data));
        } else {
            messageBox("No content is selected.");
        }
    } catch (error) {
        messageBox("error: " + error.message);
    } finally {
        SV.finish();
    }
}