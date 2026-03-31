"""
Ultron LinkedIn Design System
Extracted from design-reference.md - pixel-sampled exact values
"""

DESIGN_COLORS = {
    'claude_orange': '#BE4628',      # primary accent, Claude/Anthropic brand orange
    'ultron_orange': '#C84623',      # slightly more saturated, dark backgrounds
    'warm_orange': '#D26446',        # lighter variant, carousels/mixed layouts
    'black': '#111111',              # dark sections, hero, footer, table headers
    'warm_cream': '#F5ECE3',         # primary background for Claude-branded
    'warm_beige': '#EFEBE0',         # alternative background, Ultron content
    'warm_white_light': '#FAF9F7',   # lightest variant, near-white
    'pure_white': '#FFFFFF',         # card backgrounds inside sections
    'mid_gray': '#939391',           # body text, secondary labels
    'dark_near_black': '#2B2A26',    # text on warm backgrounds
    'light_gray': '#CCCCCC',         # dividers, borders
    'body_gray': '#888888',          # secondary text, labels
    'body_dark': '#444444',          # body text darker
}

DESIGN_RULES = {
    'dimensions': {
        'width_px': 1080,
        'height_px': 1350,
        'min_height': 1350,
    },
    'borders': {
        'max_card_radius': '4px',
        'badge_radius': '2px',
        'line_weight': '1px',
    },
    'spacing': {
        'section_padding_top': '32px',
        'section_padding_bottom': '40px',
        'section_padding_sides': '40px-48px',
        'card_padding': '16px-20px',
        'between_sections': '24px-32px',
    },
    'typography': {
        'font_primary': '"DM Sans", Arial, Helvetica, sans-serif',
        'font_mono': 'Courier New, monospace',
        'display_title': {
            'size': '52px-80px',
            'weight': 900,
            'line_height': '1.0-1.1',
            'usage': '2-3 lines max'
        },
        'section_label': {
            'size': '10px-11px',
            'weight': 600,
            'letter_spacing': '0.12em',
            'text_transform': 'uppercase',
            'color': 'orange or gray'
        },
        'h2_title': {
            'size': '28px-36px',
            'weight': 800,
            'color': '#111'
        },
        'h3_subhead': {
            'size': '14px-16px',
            'weight': 700,
            'color': '#111 or orange'
        },
        'body_text': {
            'size': '13px-14px',
            'weight': 400,
            'color': '#444 or #888',
            'line_height': '1.5-1.6'
        },
        'stat_number': {
            'size': '36px-48px',
            'weight': 900,
            'color': 'orange'
        },
        'stat_label': {
            'size': '10px-11px',
            'weight': 600,
            'text_transform': 'uppercase',
            'color': '#888'
        },
        'table_header': {
            'size': '10px-11px',
            'weight': 700,
            'text_transform': 'uppercase',
            'letter_spacing': '0.1em'
        },
        'table_body': {
            'size': '12px-13px',
            'weight': 400
        }
    },
    'forbidden': [
        'gradients',
        'box_shadows',
        'green_color',
        'blue_color',
        'purple_color',
        'yellow_color',
        'pink_color',
        'emoji_icons',
        'centered_body_text',
        'decorative_illustrations',
        'stock_photography',
        'lorem_ipsum'
    ],
    'required': [
        'footer_banner_on_every_artifact',
        'section_label_above_title',
        'subtitle_min_15px',
        'max_3_ideas_per_card',
        'one_dominant_card_or_element',
        'real_typographic_characters_in_visuals'
    ]
}

LAYOUT_PATTERNS = {
    'hero_grid': 'List 5-9 items. Dark hero top. Icon grid below.',
    'timeline': 'Sequential process. Vertical spine with numbered nodes.',
    'comparison': 'Two or more things. Clear winner column. Color coded.',
    'pyramid': 'Hierarchy. Rare at top, foundational at base.',
    'dashboard': 'Data-heavy. Large callout numbers. Metric rows.',
    'acrostic': 'Framework where letters spell a word.',
    'modular_cards': '4-6 equal-weight concepts. Grid of cards.',
    'mosaic': 'Complex, varied content. Asymmetric grid.',
    'magazine': 'Editorial. Large image area + text column.',
    'fear_card': 'What breaks when system missing. Red-tinted.',
}

MASTER_TEMPLATES = {
    'light_editorial': {
        'use_for': 'comparisons, how-to guides, cheatsheets with lots of text',
        'background': '#F8F6F1 full page',
        'header': 'section label (orange) + large H2 title (black) + subtitle (gray)',
        'sections': 'white bg on warm white page',
        'footer': 'black banner',
        'examples': 'img 1, 3, 6, 7'
    },
    'dark_hero_light_body': {
        'use_for': 'system architecture, agent explanations, bold statements, product features',
        'hero': '#111 background, 30-35% of page, massive title, stat row',
        'body': '#F8F6F1 background, 65-70% of page, feature table, grid',
        'footer': 'black banner',
        'examples': 'img 4'
    },
    'structured_mixed': {
        'use_for': 'comparison of modes/options, setup guides, decision frameworks',
        'background': '#F8F6F1',
        'header': 'large title (line 1 black bold, line 2 orange)',
        'content': 'comparison table, feature grid, decision callouts',
        'footer': 'black banner',
        'examples': 'img 2, 5'
    }
}

COMPONENT_RULES = {
    'stat_row': {
        'pattern': '4 stats in a row, full width dark background',
        'number_color': 'orange',
        'label_color': 'gray',
        'background': '#111 or #1a1a1a',
        'padding': '24px 40px'
    },
    'comparison_table': {
        'header_bg': '#111',
        'header_color': 'white',
        'winner_column': 'orange header or orange text',
        'loser_columns': 'strikethrough in light gray',
        'row_backgrounds': 'white / #F8F6F1 alternating',
        'border': '1px solid #E0DDD6'
    },
    'numbered_steps': {
        'layout': '3-column grid of cards',
        'number_position': 'top-right corner (ghost) or left-side label',
        'number_color': '#E0DDD6 ghost or orange bold',
        'title': '13px uppercase bold',
        'body': '12px-13px gray',
        'background': 'white',
        'border': '1px solid #E0DDD6'
    },
    'fear_cards': {
        'layout': '5 equal columns in a row',
        'header': '"NO [AGENT]" uppercase bold orange',
        'top_border': '2px solid orange',
        'border': '1px solid #E0DDD6',
        'background': 'white'
    },
    'code_block': {
        'background': '#111 or #1a1a1a',
        'font': 'Courier New 12px-13px',
        'color': '#F8F6F1',
        'padding': '20px 24px',
        'border_left': '3px solid orange'
    },
    'callout_box': {
        'background_light': '#F0EDE6',
        'background_emphasis': 'orange',
        'padding': '20px 24px',
        'border_left': '3px solid orange (light variant) or none (orange variant)',
        'text_color_light': '#111 / #444',
        'text_color_emphasis': 'white'
    }
}

FOOTER_BANNER = {
    'background': '#111',
    'padding': '16px 40px',
    'display': 'flex',
    'justify_content': 'space-between',
    'align_items': 'center',
    'left_text': {
        'color': '#FFFFFF',
        'font_size': '13px',
        'font_weight': 'bold',
        'content': 'Specific pain Ultron solves that Claude alone cannot'
    },
    'right_cta': {
        'color': 'orange',
        'font_size': '13px',
        'font_weight': 700,
        'content': 'See how at 51ultron.com ->'
    }
}

def validate_colors(html_content: str) -> dict:
    """
    Check if HTML uses only allowed colors from DESIGN_COLORS
    """
    import re
    
    # Extract all hex colors from HTML
    hex_pattern = r'#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b'
    colors_found = re.findall(hex_pattern, html_content)
    
    allowed_colors = set(color.lower() for color in DESIGN_COLORS.values())
    violations = []
    
    for color in colors_found:
        if f'#{color}' not in allowed_colors and f'#{color.lower()}' not in allowed_colors:
            violations.append(f'#{color}')
    
    return {
        'valid': len(violations) == 0,
        'colors_found': colors_found,
        'violations': list(set(violations))
    }

def validate_forbidden_styles(html_content: str) -> dict:
    """
    Check for forbidden CSS patterns: gradients, shadows, etc.
    """
    forbidden_patterns = {
        'gradients': [r'gradient\s*\(', r'linear-gradient', r'radial-gradient'],
        'shadows': [r'box-shadow', r'text-shadow'],
        'emoji': [r'[😀-🙏🌀-🗿]'],
    }
    
    violations = {}
    
    for pattern_type, patterns in forbidden_patterns.items():
        for pattern in patterns:
            if re.search(pattern, html_content, re.IGNORECASE):
                violations[pattern_type] = True
    
    return {
        'valid': len(violations) == 0,
        'violations': violations
    }

def validate_typography(html_content: str) -> dict:
    """
    Check font family declarations
    """
    allowed_fonts = [
        'DM Sans',
        'Arial',
        'Helvetica',
        'Courier New',
        'monospace',
        'sans-serif'
    ]
    
    import re
    font_pattern = r'font-family\s*:\s*([^;]+)'
    fonts_found = re.findall(font_pattern, html_content)
    
    violations = []
    for font in fonts_found:
        if not any(allowed in font for allowed in allowed_fonts):
            violations.append(font.strip())
    
    return {
        'valid': len(violations) == 0,
        'fonts_found': fonts_found,
        'violations': violations
    }

if __name__ == '__main__':
    print("Design System Module Loaded")
    print(f"Colors: {len(DESIGN_COLORS)}")
    print(f"Patterns: {len(LAYOUT_PATTERNS)}")
    print(f"Templates: {len(MASTER_TEMPLATES)}")
