.PHONY: check

run: pre-commit
	flask --app main run

pre-commit:
	@echo "Running pre-commit checks..."
	@bash .git/hooks/pre-commit
	@echo "All checks passed."

test-js:
	rm static/js/*
	cp src/js/* static/js
