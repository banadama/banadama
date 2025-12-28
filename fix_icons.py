import re

with open('app/marketplace/page.tsx', 'r') as f:
    content = f.read()

# For CheckIcon - appears many times with same style
# Using simple text replacement instead of regex to avoid escaping issues
old_check = "{CheckIcon && <CheckIcon size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />}"
new_check = '<span style={{color: \'#10b981\', fontSize: \'1.25rem\'}}>✓</span>'
content = content.replace(old_check, new_check)

# For CartIcon
old_cart = "{CartIcon && <CartIcon size={24} />}"
new_cart = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
content = content.replace(old_cart, new_cart)

# For User
old_user = "{UserIcon && <UserIcon size={16} />}"
new_user = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>'
content = content.replace(old_user, new_user)

# For Search
old_search = "{SearchIcon && <SearchIcon size={20} />}"
new_search = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'
content = content.replace(old_search, new_search)

# For Star
old_star = "{StarIcon && <StarIcon size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />}"
new_star = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 10.26 24 11.27 18 17.14 19.18 26.02 12 21.77 4.82 26.02 6 17.14 0 11.27 8.91 10.26 12 2"/></svg>'
content = content.replace(old_star, new_star)

with open('app/marketplace/page.tsx', 'w') as f:
    f.write(content)

print("Icon replacements completed")

