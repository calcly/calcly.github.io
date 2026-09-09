# History timestamps

## Problem
History calculation times disappear after a page refresh.

## Cause
The calculation text was saved to localStorage, but the timestamp shown beside each calculation was not saved.

## Expected behavior
Each new history item should save its calculation and timestamp in localStorage and restore both after refresh.

## Compatibility
Existing history entries stored as plain strings should continue to load without breaking the history list.