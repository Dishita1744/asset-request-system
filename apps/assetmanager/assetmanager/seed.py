import frappe

def run():
    frappe.set_user("Administrator")
    assets = [
        {"asset_name": "MacBook Pro", "asset_type": "Hardware", 
         "total_quantity": 5, "available_quantity": 5},
        {"asset_name": "Dell 24-inch Monitor", "asset_type": "Hardware", 
         "total_quantity": 10, "available_quantity": 10},
        {"asset_name": "Office Chair", "asset_type": "Furniture", 
         "total_quantity": 20, "available_quantity": 20},
        {"asset_name": "Microsoft Office License", "asset_type": "Software", 
         "total_quantity": 15, "available_quantity": 15},
    ]
    for a in assets:
        if not frappe.db.exists("Office Asset", a["asset_name"]):
            doc = frappe.get_doc({"doctype": "Office Asset", **a})
            doc.insert(ignore_permissions=True)
    frappe.db.commit()
    print("Seed data inserted successfully.")
