#!/bin/bash
git filter-branch -f --tree-filter '
for file in *.md; do
  if [ -f "$file" ]; then
    sed -i "s/sk-proj-[^ ]*/your-openai-api-key-here/g" "$file" 2>/dev/null || true
    sed -i "s/sk-proj-[^`]*/your-openai-api-key-here/g" "$file" 2>/dev/null || true
  fi
done
' --prune-empty -- --all

