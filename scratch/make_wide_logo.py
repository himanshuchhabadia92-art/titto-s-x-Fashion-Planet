from PIL import Image, ImageDraw, ImageFont

# Open 600 DPI crisp original tag logo
tag_img = Image.open(r'c:\Users\hp\Downloads\fashion_planet\public\logo-white.png')

# 1. Create wide composite logo: Tag Badge + Horizontal TITTO'S X FASHION PLANET
wide_canvas = Image.new('RGBA', (1500, 420), (255, 255, 255, 0))

# Crop transparent padding from tag_img
bbox = tag_img.getbbox()
if bbox:
    tag_cropped = tag_img.crop(bbox)
else:
    tag_cropped = tag_img

# Resize tag icon to fit height 400px
h = 400
w = int(tag_cropped.width * (h / tag_cropped.height))
tag_resized = tag_cropped.resize((w, h), Image.Resampling.LANCZOS)
wide_canvas.paste(tag_resized, (0, 10), tag_resized)

# Draw elegant horizontal brand text on the right
draw = ImageDraw.Draw(wide_canvas)

try:
    font_large = ImageFont.truetype("arialbd.ttf", 130)
    font_sub = ImageFont.truetype("arialbd.ttf", 85)
    font_x = ImageFont.truetype("arialbd.ttf", 80)
except Exception:
    font_large = font_sub = font_x = ImageFont.load_default()

# Draw text
draw.text((w + 40, 30), "TITTO'S", fill=(255, 255, 255, 255), font=font_large)
draw.text((w + 600, 60), "X", fill=(140, 198, 101, 255), font=font_x) # Accent green X
draw.text((w + 40, 200), "FASHION PLANET", fill=(255, 255, 255, 255), font=font_sub)

wide_canvas.save(r'c:\Users\hp\Downloads\fashion_planet\public\logo-wide-white.png')

# 2. Also create a cropped & scaled version of just the tag logo stretched horizontally a bit (logo-tag-wide.png)
tag_wide = tag_cropped.resize((int(tag_cropped.width * 1.35), tag_cropped.height), Image.Resampling.LANCZOS)
tag_wide.save(r'c:\Users\hp\Downloads\fashion_planet\public\logo-tag-wide.png')

print("Generated logo-wide-white.png and logo-tag-wide.png successfully!")
