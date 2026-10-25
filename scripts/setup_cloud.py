#!/usr/bin/env python3
"""Install the optional cloud client without another repository's environment."""

from pathlib import Path
import os
import subprocess
import sys
import venv


def main() -> int:
    if not (3, 11) <= sys.version_info[:2] < (3, 15):
        print("Cloud setup requires Python 3.11–3.14 (3.13 recommended).", file=sys.stderr)
        return 1

    root = Path(__file__).resolve().parent.parent
    environment = root / ".venv"
    # Recreate this disposable client environment so Python upgrades cannot leave
    # stale interpreter links or packages from a different Python minor version.
    venv.EnvBuilder(with_pip=True, symlinks=os.name != "nt", clear=True).create(environment)
    python = environment / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    subprocess.run(
        [
            str(python), "-I", "-m", "pip", "install",
            "--disable-pip-version-check", "-r", str(root / "requirements-cloud.txt"),
        ],
        check=True,
    )
    subprocess.run([str(python), "-I", "-m", "pip", "check"], check=True)
    subprocess.run([str(python), "-I", "-m", "modal", "--version"], check=True)
    print("Cloud client ready in .venv. Existing machine Modal authentication is reused.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as exc:
        raise SystemExit(exc.returncode) from None
