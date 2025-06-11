# commonnote-svs
 Synthesizer V Studio scripts for supporting [commonnote](https://github.com/ExpressiveLabs/commonnote) as a cross-application copy paste specification.

# Installation
 1. Clone this repository in any way you prefer and put it in the corresponding scripts folder for Synthesizer V Pro or Synthesizer V 2 Pro.
    - Open Synthesizer V and go to `Scripts > Open Scripts Folder` to locate this folder.
 2. (Optional) Assign keybinds for each script.
    - Suggestions:
      - `Alt + C` : Copy
      - `Alt + V` : Paste (at playhead)
      - `Alt + Shift + V` : Paste (relative to group)
    - You may add `Ctrl` if it is preferred.

# Functions
### Copy
 Copies notes into the commonnote specification to the system's clipboard. This includes Synthesizer V group data as well.

### Paste (at playhead)
 Pastes notes where the start of first note is placed directly on the playhead's position. The position of the playhead is snapped according to the grid to avoid positioning issues.

### Paste (relative to group)
 Pastes notes where the notes are pasted directly at the start of the selected group. Offsets from the start of the data is preserved.

# Special Thanks
 - [layetri](https://bsky.app/profile/did:plc:7pxorada7qfusdcsogow33yi): Making commonnote
 - [Xero](https://bsky.app/profile/did:plc:gu3mc2q4cdbsjjcyo44ye53w) (**Warning:** 18+ account): Japanese translation help
 - [UTAU France](https://utaufrance.com/): French translation help

# Progress
 - [x] Copy
 - [ ] Paste (at playhead)
 - [ ] Paste (relative to group)