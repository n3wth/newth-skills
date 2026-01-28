#!/usr/bin/env python3
"""
Validate skill packages for compliance with newth-skills standards.

This script checks that skills follow the required structure, have proper
documentation, and are ready for integration into the skills registry.

Usage:
    python3 scripts/validate-skill.py <skill_path>
    python3 scripts/validate-skill.py skills/cursor-project-bootstrapper.skill
"""

import sys
import os
import json
from pathlib import Path
from typing import Optional, Tuple, List
import yaml
import re


class SkillValidator:
    """Validates skill packages against newth-skills standards."""

    REQUIRED_DIRECTORIES = ['scripts', 'templates', 'references']
    REQUIRED_FILES = ['SKILL.md']
    VALID_CATEGORIES = ['development', 'documents', 'creative', 'productivity', 'business']
    VALID_PLATFORMS = ['claude-code', 'gemini-cli', 'cursor', 'vscode', 'copilot']
    VALID_STATUSES = ['experimental', 'beta', 'stable', 'deprecated']

    def __init__(self, skill_path: str):
        """Initialize validator for a skill package."""
        self.skill_path = Path(skill_path).resolve()
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.valid = True

    def validate(self) -> bool:
        """Run full validation suite."""
        if not self._check_path_exists():
            return False

        if not self._check_directory_structure():
            self.valid = False

        if not self._check_skill_metadata():
            self.valid = False

        if not self._check_scripts():
            self.valid = False

        if not self._check_documentation():
            self.valid = False

        return self.valid

    def _check_path_exists(self) -> bool:
        """Verify the skill path exists."""
        if not self.skill_path.exists():
            self.errors.append(f"Skill path does not exist: {self.skill_path}")
            self.valid = False
            return False

        if not self.skill_path.is_dir():
            self.errors.append(f"Skill path is not a directory: {self.skill_path}")
            self.valid = False
            return False

        return True

    def _check_directory_structure(self) -> bool:
        """Check that skill has required directory structure."""
        success = True

        for dirname in self.REQUIRED_DIRECTORIES:
            dirpath = self.skill_path / dirname
            if not dirpath.exists():
                self.warnings.append(f"Missing directory: {dirname}/")
            elif not dirpath.is_dir():
                self.errors.append(f"Not a directory: {dirname}")
                success = False

        return success

    def _check_skill_metadata(self) -> bool:
        """Check SKILL.md frontmatter and structure."""
        skill_md = self.skill_path / 'SKILL.md'

        if not skill_md.exists():
            self.errors.append("Missing SKILL.md file")
            return False

        try:
            with open(skill_md, 'r') as f:
                content = f.read()

            # Extract YAML frontmatter
            if not content.startswith('---'):
                self.errors.append("SKILL.md must start with --- (YAML frontmatter)")
                return False

            parts = content.split('---', 2)
            if len(parts) < 3:
                self.errors.append("SKILL.md must have YAML frontmatter enclosed in ---")
                return False

            frontmatter_str = parts[1].strip()
            body = parts[2].strip()

            # Parse YAML
            try:
                metadata = yaml.safe_load(frontmatter_str)
            except yaml.YAMLError as e:
                self.errors.append(f"Invalid YAML in SKILL.md frontmatter: {e}")
                return False

            # Validate required fields
            required_fields = ['name', 'slug', 'description', 'author', 'version',
                             'categories', 'platforms', 'status']
            for field in required_fields:
                if field not in metadata:
                    self.errors.append(f"Missing required field in SKILL.md: {field}")
                    return False

            # Validate field values
            if not isinstance(metadata['name'], str) or not metadata['name'].strip():
                self.errors.append("Field 'name' must be a non-empty string")
                return False

            if not isinstance(metadata['slug'], str) or not metadata['slug'].strip():
                self.errors.append("Field 'slug' must be a non-empty string")
                return False

            # Validate slug format (kebab-case)
            if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', metadata['slug']):
                self.errors.append(f"Field 'slug' must be kebab-case: {metadata['slug']}")
                return False

            if not isinstance(metadata['categories'], list):
                self.errors.append("Field 'categories' must be a list")
                return False

            for cat in metadata['categories']:
                if cat not in self.VALID_CATEGORIES:
                    self.errors.append(f"Invalid category '{cat}'. Must be one of: {', '.join(self.VALID_CATEGORIES)}")
                    return False

            if not isinstance(metadata['platforms'], list):
                self.errors.append("Field 'platforms' must be a list")
                return False

            for platform in metadata['platforms']:
                if platform not in self.VALID_PLATFORMS:
                    self.warnings.append(f"Unknown platform '{platform}'")

            if metadata['status'] not in self.VALID_STATUSES:
                self.errors.append(f"Invalid status '{metadata['status']}'. Must be one of: {', '.join(self.VALID_STATUSES)}")
                return False

            # Check body content exists
            if not body:
                self.warnings.append("SKILL.md documentation body is empty")

            return True

        except Exception as e:
            self.errors.append(f"Error reading SKILL.md: {e}")
            return False

    def _check_scripts(self) -> bool:
        """Check that scripts are properly formatted."""
        scripts_dir = self.skill_path / 'scripts'

        if not scripts_dir.exists():
            self.warnings.append("No scripts/ directory found")
            return True

        scripts = list(scripts_dir.glob('*'))

        if not scripts:
            self.warnings.append("scripts/ directory is empty")
            return True

        success = True

        for script in scripts:
            if script.is_file():
                # Check file permissions
                if not os.access(script, os.X_OK):
                    self.warnings.append(f"Script not executable: {script.name}")

                # Check shebang for Python/Bash
                try:
                    with open(script, 'r', encoding='utf-8', errors='ignore') as f:
                        first_line = f.readline().strip()

                    if not first_line.startswith('#!'):
                        self.warnings.append(f"Script missing shebang: {script.name}")

                except Exception as e:
                    self.errors.append(f"Cannot read script {script.name}: {e}")
                    success = False

        return success

    def _check_documentation(self) -> bool:
        """Check that documentation is complete."""
        templates_dir = self.skill_path / 'templates'
        references_dir = self.skill_path / 'references'

        success = True

        if templates_dir.exists():
            templates = list(templates_dir.glob('*.md'))
            if not templates:
                self.warnings.append("templates/ directory exists but contains no .md files")
        else:
            self.warnings.append("No templates/ directory found")

        if references_dir.exists():
            references = list(references_dir.glob('*.md'))
            if not references:
                self.warnings.append("references/ directory exists but contains no .md files")
        else:
            self.warnings.append("No references/ directory found")

        return success

    def print_report(self) -> None:
        """Print validation report."""
        print(f"\n{'='*60}")
        print(f"Skill Validation Report: {self.skill_path.name}")
        print(f"{'='*60}\n")

        if self.errors:
            print(f"❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
            print()

        if self.warnings:
            print(f"⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")
            print()

        if not self.errors and not self.warnings:
            print("✅ All validation checks passed!\n")

        print(f"Status: {'PASS ✅' if self.valid else 'FAIL ❌'}\n")


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/validate-skill.py <skill_path>")
        print("Example: python3 scripts/validate-skill.py skills/cursor-project-bootstrapper.skill")
        sys.exit(1)

    skill_path = sys.argv[1]
    validator = SkillValidator(skill_path)

    is_valid = validator.validate()
    validator.print_report()

    sys.exit(0 if is_valid else 1)


if __name__ == '__main__':
    main()
