import frappe
from frappe.model.document import Document

class AssetRequest(Document):

    def before_insert(self):
        asset = frappe.get_doc("Office Asset", self.asset)
        if asset.available_quantity <= 0:
            frappe.throw("This asset is out of stock and cannot be requested.")

    def on_update(self):
        if self.status == "Approved":
            asset = frappe.get_doc("Office Asset", self.asset)
            if asset.available_quantity > 0:
                asset.available_quantity -= 1
                asset.save(ignore_permissions=True)
