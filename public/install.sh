#!/bin/bash
# newth.ai skills installer
# Usage: curl -fsSL https://skills.newth.ai/install.sh | bash [-s -- gemini|claude|cursor|windsurf|cody|copilot]

set -e

SKILLS_REPO="https://github.com/n3wth/newth-skills.git"
SKILLS_DIR="$HOME/.skills"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}╭─────────────────────────────────────╮${NC}"
    echo -e "${BLUE}│${NC}    ${GREEN}newth.ai skills installer${NC}        ${BLUE}│${NC}"
    echo -e "${BLUE}╰─────────────────────────────────────╯${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}→${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Detect platform
detect_platform() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)  echo "linux" ;;
        *)       echo "unknown" ;;
    esac
}

# Get skills source directory
get_skills_source() {
    # Check common locations
    if [ -d "$HOME/.claude/skills" ]; then
        echo "$HOME/.claude/skills"
    elif [ -d "$HOME/.gemini/skills" ]; then
        echo "$HOME/.gemini/skills"
    else
        echo ""
    fi
}

# Install for Gemini CLI
install_gemini() {
    print_info "Installing skills for Gemini CLI..."

    GEMINI_DIR="$HOME/.gemini"
    GEMINI_SKILLS="$GEMINI_DIR/skills"

    # Create directory if needed
    mkdir -p "$GEMINI_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$GEMINI_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$GEMINI_SKILLS/$name" ]; then
                    ln -s "$skill" "$GEMINI_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$GEMINI_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    # Update GEMINI.md if it exists
    if [ -f "$GEMINI_DIR/GEMINI.md" ]; then
        print_success "Gemini CLI configuration found"
    else
        print_warning "Create $GEMINI_DIR/GEMINI.md to configure skills"
    fi

    print_success "Gemini CLI skills installed to $GEMINI_SKILLS"
}

# Install for Claude Code
install_claude() {
    print_info "Installing skills for Claude Code..."

    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_SKILLS="$CLAUDE_DIR/skills"

    # Create directory if needed
    mkdir -p "$CLAUDE_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$CLAUDE_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$CLAUDE_SKILLS/$name" ]; then
                    ln -s "$skill" "$CLAUDE_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$CLAUDE_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    # Check for settings.json
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        print_success "Claude Code configuration found"
    else
        print_warning "Create $CLAUDE_DIR/settings.json to configure skills"
    fi

    print_success "Claude Code skills installed to $CLAUDE_SKILLS"
}

# Install for Cursor
install_cursor() {
    print_info "Installing skills for Cursor..."

    CURSOR_DIR="$HOME/.cursor"
    CURSOR_SKILLS="$CURSOR_DIR/skills"

    # Create directory if needed
    mkdir -p "$CURSOR_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$CURSOR_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$CURSOR_SKILLS/$name" ]; then
                    ln -s "$skill" "$CURSOR_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$CURSOR_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    print_success "Cursor skills installed to $CURSOR_SKILLS"
}

# Install for Windsurf
install_windsurf() {
    print_info "Installing skills for Windsurf..."

    WINDSURF_DIR="$HOME/.windsurf"
    WINDSURF_SKILLS="$WINDSURF_DIR/skills"

    # Create directory if needed
    mkdir -p "$WINDSURF_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$WINDSURF_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$WINDSURF_SKILLS/$name" ]; then
                    ln -s "$skill" "$WINDSURF_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$WINDSURF_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    print_success "Windsurf skills installed to $WINDSURF_SKILLS"
}

# Install for Cody
install_cody() {
    print_info "Installing skills for Sourcegraph Cody..."

    CODY_DIR="$HOME/.cody"
    CODY_SKILLS="$CODY_DIR/skills"

    # Create directory if needed
    mkdir -p "$CODY_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$CODY_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$CODY_SKILLS/$name" ]; then
                    ln -s "$skill" "$CODY_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$CODY_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    print_success "Cody skills installed to $CODY_SKILLS"
}

# Install for GitHub Copilot
install_copilot() {
    print_info "Installing skills for GitHub Copilot..."

    COPILOT_DIR="$HOME/.copilot"
    COPILOT_SKILLS="$COPILOT_DIR/skills"

    # Create directory if needed
    mkdir -p "$COPILOT_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$COPILOT_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$COPILOT_SKILLS/$name" ]; then
                    ln -s "$skill" "$COPILOT_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$COPILOT_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    print_success "GitHub Copilot skills installed to $COPILOT_SKILLS"
}

# Main
print_header

PLATFORM=$(detect_platform)
print_info "Detected platform: $PLATFORM"

TARGET="${1:-all}"

case "$TARGET" in
    gemini)
        install_gemini
        ;;
    claude)
        install_claude
        ;;
    cursor)
        install_cursor
        ;;
    windsurf)
        install_windsurf
        ;;
    cody)
        install_cody
        ;;
    copilot)
        install_copilot
        ;;
    all)
        install_gemini
        echo ""
        install_claude
        echo ""
        install_cursor
        echo ""
        install_windsurf
        echo ""
        install_cody
        echo ""
        install_copilot
        ;;
    *)
        print_error "Unknown target: $TARGET"
        echo "Usage: $0 [gemini|claude|cursor|windsurf|cody|copilot|all]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Restart your AI assistant"
echo "  2. Try using a skill: /pdf, /xlsx, /gsap-animations"
echo ""
echo -e "Learn more at ${BLUE}https://skills.newth.ai${NC}"
echo ""
