.PHONY: check

pre-commit:
	@echo "Running pre-commit checks..."
	@bash .git/hooks/pre-commit
	@echo "All checks passed."

test-js:
	rm static/js/*
	cp src/js/* static/js
