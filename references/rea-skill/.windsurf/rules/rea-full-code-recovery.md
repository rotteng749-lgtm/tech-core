# REA Full Code Recovery Directive (Windsurf)

When the user asks to recover full source code of their app because they lost their code or want full A-Z codes (or references `$rea-full-code-recovery`):
1. **Zero Skeleton Law:** Never output partial skeletons, stubs, pseudocode, or `// TODO` placeholders. Always reconstruct 100% working, complete, and compilable source code for every file.
2. **Autonomous Execution:** Execute the full 5-step pipeline automatically:
   - Inspect binary structure, entry points, window procs, debug paths, assertion strings, and APIs using REA MCP (`open_binary`, `list_procedures`, `batch_decompile`, `inspect_pe_resources`) and Rizin/Ghidra.
   - Extract all embedded resources (icons with valid ICO headers, manifests, binary tables, fonts, shaders).
   - Reconstruct the complete source tree (`Source/`, `Resources/`, `Bin/`, `Documentation/`) with full feature logic.
   - Create a 1-click multi-compiler build script (`build.bat` / `build.sh`) supporting Zig CC, MSVC, MinGW GCC, and Clang.
   - Run the build script automatically to verify 0 errors and 0 warnings before concluding.
