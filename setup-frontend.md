Use the following fonts, colors, themes and other design elements from this styleguide for the frontend.

# Basic Setup
If not otherwise specified the result should be simple html, CSS & JS.
Write the complete code for every step. Do not get lazy. Pay attention to details (e.g. spacing, alignment, colors, style checkboxes, radio buttons, range sliders, inputs, etc.). Write everything that is needed.

Your goal is to completely finish the frontend.

### Basic Setup - Use tailwindcss via:
<script src="https://cdn.tailwindcss.com"></script>

### Basic Setup - Always extend styles to tailwindcss via:
<script>
    tailwind.config = {
        theme: {
            extend: {
                ...
            }
        }
    }
</script>

### Basic Setup - if possible always use tailwind classes

# Custom Styles

### Main Colors
Primary Color: #52B6D3
Primary Color Dark: #337082
Primary Color Light: #52B6D3

Secondary Color: #FFCD0C
Secondary Color Dark: #FFCD0C
Secondary Color Light: #FFCD0C

Page Background: #ffffff

### Neutral colors
White: #FFFFFF
Black: #000000
Gray: #f6f6f6
Border Color: #D0DFE4

### Typography
Font Family: 'Barlow', sans-serif
Font Weight: 400
Color: #000000

### Headings
Font Family: 'Barlow', sans-serif
Font Weight: 700
Color: #000000

### Containers
Max Width: 1200px
Max Width Small: 750px

### Buttons Primary
Background: (use secondary color)
Background Hover: (use secondary color light)
Color: #000000
Font Weight: 600


