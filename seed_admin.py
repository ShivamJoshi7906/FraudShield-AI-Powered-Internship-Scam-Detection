"""
seed_admin.py
-------------
Run this script ONCE to create the default admin account in MongoDB.

  Default Credentials:
    Email   : admin@fraudshield.com
    Password: Admin@1234
    Role    : admin

After running, restart app.py and log in via the Admin Login page.
"""

import bcrypt
from datetime import datetime
from database import users_collection

ADMIN_EMAIL    = "admin@fraudshield.com"
ADMIN_PASSWORD = "Admin@1234"
ADMIN_NAME     = "Super Admin"

# Check if admin already exists
existing = users_collection.find_one({"email": ADMIN_EMAIL, "role": "admin"})

if existing:
    print(f"[INFO] Admin account already exists: {ADMIN_EMAIL}")
else:
    hashed_pw = bcrypt.hashpw(ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt())
    admin_doc = {
        "name":        ADMIN_NAME,
        "email":       ADMIN_EMAIL,
        "password":    hashed_pw,
        "role":        "admin",
        "joined_date": datetime.utcnow().isoformat().split("T")[0],
        "created_at":  datetime.utcnow(),
    }
    users_collection.insert_one(admin_doc)
    print("[SUCCESS] Default admin account created successfully!")
    print(f"   Email   : {ADMIN_EMAIL}")
    print(f"   Password: {ADMIN_PASSWORD}")
    print("\n[WARNING] Keep these credentials safe and change the password after first login.")
