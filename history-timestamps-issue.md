# History timestamps persistence

The history timestamp was visible before refresh but disappeared after refresh because only the calculation string was persisted. This change stores calculation, timestamp, and a unique ID in localStorage and restores the timestamp on load.

Existing string-based history entries remain compatible.