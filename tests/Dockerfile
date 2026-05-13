FROM python:3.12-alpine

WORKDIR /tests

COPY . .

CMD ["python", "-m", "unittest", "discover", "-s", ".", "-p", "test_*.py", "-v"]
