#!/bin/sh
set -e

# Configuration
LOCALES_DIR="./src/locales"
SOURCE_LANG="en"

echo "Detected Source Language: $SOURCE_LANG"

# 1. Loop through all directories in src/locales
for LANG_PATH in "$LOCALES_DIR"/*; do
    TARGET_LANG=$(basename "$LANG_PATH")

    # Skip if it's not a directory or if it is the source language
    if [ ! -d "$LANG_PATH" ] || [ "$TARGET_LANG" = "$SOURCE_LANG" ]; then
        continue
    fi

    echo "---------------------------------------------------"
    echo "Checking: $TARGET_LANG"
    echo "---------------------------------------------------"

    # 2. Find all JSON files in the Source Language folder
    find "$LOCALES_DIR/$SOURCE_LANG" -type f -name "*.json" | while read -r SOURCE_FILE; do

        # Calculate target path
        TARGET_FILE=$(echo "$SOURCE_FILE" | sed "s|/$SOURCE_LANG/|/$TARGET_LANG/|")
        FILE_NAME=$(basename "$SOURCE_FILE")

        # Ensure directory exists
        mkdir -p "$(dirname "$TARGET_FILE")"

        if [ -f "$TARGET_FILE" ]; then
            # File exists: Find keys present in Source but MISSING in Target
            # We use jq to list paths that exist in $src but return null in $tgt
            MISSING_KEYS=$(jq -n -r --slurpfile src "$SOURCE_FILE" --slurpfile tgt "$TARGET_FILE" '
                $src[0] as $s | $tgt[0] as $t |
                ($s | paths(scalars)) as $p |
                if ($t | getpath($p)) == null then
                    $p | join(".")
                else
                    empty
                end
            ')

            # If we found missing keys, print them and perform the merge
            if [ -n "$MISSING_KEYS" ]; then
                echo "  [UPDATE] $FILE_NAME"
                echo "$MISSING_KEYS" | sed 's/^/     + /'

                # Perform the actual merge (Source fills gaps in Target)
                jq -s '.[0] * .[1]' "$SOURCE_FILE" "$TARGET_FILE" > "$TARGET_FILE.tmp"
                mv "$TARGET_FILE.tmp" "$TARGET_FILE"
            fi
        else
            # File entirely missing
            echo "  [NEW]    $FILE_NAME (Copying entire file)"
            cp "$SOURCE_FILE" "$TARGET_FILE"
        fi
    done
done

echo "---------------------------------------------------"
echo "Locale sync complete."