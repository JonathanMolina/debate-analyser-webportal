import os
from PIL import Image, ImageDraw, ImageFilter

def create_argumeta_png(output_path, size=1024, transparent=False):
    # Supersampling 4x para renderização ultra nítida e anti-serrilhada
    scale = 4
    canvas_size = size * scale
    
    if transparent:
        img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    else:
        # Fundo Ônix profundo #090C0E
        img = Image.new("RGBA", (canvas_size, canvas_size), (9, 12, 14, 255))
        
    draw = ImageDraw.Draw(img)
    
    # Se não for transparente, desenhar um container arredondado sofisticado
    if not transparent:
        # Brilho sutil radial esmeralda no centro
        glow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        center = canvas_size // 2
        radius = int(canvas_size * 0.35)
        glow_draw.ellipse(
            (center - radius, center - radius, center + radius, center + radius),
            fill=(52, 211, 153, 22)
        )
        glow = glow.filter(ImageFilter.GaussianBlur(radius=60 * scale))
        img.alpha_composite(glow)
        draw = ImageDraw.Draw(img)

    # Coordenadas do triângulo Delta / Letra A
    # Topo (centro), Base Direita, Base Esquerda
    padding_top = int(canvas_size * 0.20)
    padding_bottom = int(canvas_size * 0.80)
    center_x = canvas_size // 2
    half_width = int(canvas_size * 0.32)
    
    top = (center_x, padding_top)
    bottom_right = (center_x + half_width, padding_bottom)
    bottom_left = (center_x - half_width, padding_bottom)
    
    stroke_width = int(32 * scale)
    
    # Camada de Glow da linha
    glow_line = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    glow_line_draw = ImageDraw.Draw(glow_line)
    
    # Cor do glow: Sálvia Esmeralda #34D399 com alfa
    glow_color = (52, 211, 153, 90)
    glow_line_draw.line([top, bottom_right, bottom_left, top], fill=glow_color, width=stroke_width + int(18 * scale), joint="round")
    
    # Barra horizontal da letra A
    bar_y = int(padding_top + (padding_bottom - padding_top) * 0.64)
    # Interseção linear nos lados
    ratio = 0.64
    bar_x_left = int(center_x - half_width * ratio)
    bar_x_right = int(center_x + half_width * ratio)
    
    glow_line_draw.line([(bar_x_left, bar_y), (bar_x_right, bar_y)], fill=glow_color, width=stroke_width + int(18 * scale))
    glow_line = glow_line.filter(ImageFilter.GaussianBlur(radius=12 * scale))
    img.alpha_composite(glow_line)
    draw = ImageDraw.Draw(img)
    
    # Linha principal nítida: Sálvia Esmeralda #34D399
    primary_color = (52, 211, 153, 255)
    draw.line([top, bottom_right, bottom_left, top], fill=primary_color, width=stroke_width, joint="round")
    draw.line([(bar_x_left, bar_y), (bar_x_right, bar_y)], fill=primary_color, width=stroke_width)
    
    # Linha interna sutil de luz (highlight)
    inner_stroke = int(8 * scale)
    inner_color = (236, 253, 245, 220) # #ECFDF5
    draw.line([top, bottom_right, bottom_left, top], fill=inner_color, width=inner_stroke, joint="round")
    draw.line([(bar_x_left, bar_y), (bar_x_right, bar_y)], fill=inner_color, width=inner_stroke)
    
    # Ponto central de calibração algorítmica
    dot_y = int(padding_top + (padding_bottom - padding_top) * 0.36)
    dot_r = int(14 * scale)
    draw.ellipse((center_x - dot_r, dot_y - dot_r, center_x + dot_r, dot_y + dot_r), fill=inner_color)

    # Redimensionar com filtro Lanczos de altíssima qualidade
    img_final = img.resize((size, size), Image.Resampling.LANCZOS)
    img_final.save(output_path, "PNG", optimize=True)
    print(f"Salvo: {output_path} ({size}x{size})")

if __name__ == "__main__":
    out_dir = r"c:\repos\DebateAnalyser\debate-analyser-webportal\public"
    os.makedirs(out_dir, exist_ok=True)
    
    # 1. Logo com fundo Ônix elegante
    create_argumeta_png(os.path.join(out_dir, "logo.png"), size=1024, transparent=False)
    # 2. Logo com fundo transparente (ótimo para overlays e banners)
    create_argumeta_png(os.path.join(out_dir, "logo-transparent.png"), size=1024, transparent=True)
    # 3. Logo menor para ícone / avatar
    create_argumeta_png(os.path.join(out_dir, "logo-512.png"), size=512, transparent=False)
