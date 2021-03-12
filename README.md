# be-tech-test-node

Create 3 tables: admin, editor, tester

1. For all tables you want to have records with the following fields:
  - Id
  - Text
  - isEditable (default value is false)
2. Create 3 types of users with different permissions
  - Admin - has access to all 3 tables
    - Permissions: CRUD
  - Editor - has access to editor and tester tables
    - Permissions: CR
      - If `isEditable` true - user can Update `text` field
  - Tester - has access to tester table only
    - Permissions: CR
3. Create a route to auth a user


##### NOTE: 
1. Only authorised user can read/modify data
2. If you make a call as an admin - return `text` from all tables, if you make a call as an editor - return `text` from editor and tester tables, for tester - just `text` from tester’s table
3. If the user tries to make unauthorised call return unauthorised error.
