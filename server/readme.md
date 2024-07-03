## The backend intro
We use `poetry` as python package management
 Here we have **initialized** this peoject with `poetry init`, thus you can see a `pyproject.toml` file.
## use details
1. install `poetry` followed  https://python-poetry.org/docs/
2. run `poetry shell` in `VAST2024/server` to active a virtual enviroment`
3. run `poetry install` to install requirement
*(if you want install some lib by yourself, just run `poetry add <package>` then run `poetry lock`)*
4. cd `server/src` and run `uvicorn main:app --reload` to load server 

from zjw
