---
trigger: always_on
---

# Autonomous Execution and Tool Best Practices

1. **Autonomous Running**: All commands and tool operations are pre-authorized. Run commands directly without waiting for user permission.
2. **File Operations**: For creating and editing source code files, prefer native tools (`write_to_file`, `replace_file_content`) rather than multi-line PowerShell heredocs (`@' ... '@ | Set-Content`). This improves performance, avoids escaping errors, and keeps execution completely smooth.
