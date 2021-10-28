# Hard Links


## Install
```bash
npm i -g hard-links
```

## Usage
```bash
hln [command]

Commands:
  hln link [src] [dest] [fullCheck]  Start to hard link
  hln link-plus [config]             Start to hard link plus

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### 1. Command: link
```bash
hln link [src] [dest] [fullCheck]
```
| Option | Description |
|---|---|
| src | Source |
| dest | Destination |
| fullCheck | Full checking, default is false |

### 2. Command: link-plus
```bash
hln link-plus [config]
```

| Option | Description |
|---|---|
| config | Config file path (.json) |

#### Config file example
```json
{
  "name": "Just link movies",
  "configs": [
    {
      "src": "[path-to-you-root]/download",
      "dest": "[path-to-you-root]/media",
      "excludes": [
        "[path-to-you-root]/download/seed",
        "[path-to-you-root]/download/_temp",
        "[path-to-you-root]/download/_stash",
      ],
      "fullCheck": false
    }
  ]
}
```
