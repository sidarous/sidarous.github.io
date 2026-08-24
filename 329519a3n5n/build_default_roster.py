"""Build the file://-compatible default roster from studname.csv."""

import json
from pathlib import Path


SOURCE = Path("studname.csv")
OUTPUT = Path("default-roster.js")


def main():
    csv_text = SOURCE.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    lines = csv_text.split("\n")
    if lines and lines[-1] == "":
        lines.pop()

    rendered_lines = ",\n".join(f"  {json.dumps(line, ensure_ascii=False)}" for line in lines)
    output = (
        "// Bundled default roster. Imported CSV data overrides this in browser storage.\n"
        "// Regenerate with: python build_default_roster.py\n"
        "window.DEFAULT_ROSTER_CSV = [\n"
        f"{rendered_lines}\n"
        "].join(\"\\n\");\n"
    )
    OUTPUT.write_text(output, encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(lines) - 1} student rows")


if __name__ == "__main__":
    main()
