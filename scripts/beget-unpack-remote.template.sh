for d in __PATHS_Q__; do mkdir -p "$d" && rm -rf "$d"/* && tar -xzf "$HOME/beget-out.tar.gz" -C "$d" && echo "unpacked: $d"; done; rm -f "$HOME/beget-out.tar.gz"
