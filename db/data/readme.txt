Fill `membership_riddle_traits.private.json` and `membership_riddle_nouns.private.json` 
with the allowed traits and nouns used to solve the membership riddle.

These files must contain flat arrays of allowed traits and nouns, formatted in valid JSON.

To avoid leaking possible solutions, `.private.json` files are not tracked by Git. Instead, 
`membership_riddle_traits.private.json.example` and `membership_riddle_nouns.private.json.example` 
are provided as minimal examples of the expected format.

Remember to update `views/joinTheClub.ejs` with a clear description of the types of items your club accepts.

Tip: Insert as many words as possible to preserve trait–noun uniqueness across users.
