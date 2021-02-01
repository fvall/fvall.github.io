---
title: Create a financial dashboard with Flask - Part 1
date: 2021-01-31
categories: python, flask
---

This is the first post of a three part series of how to create a financial dashboard with Flask. [Flask](https://flask.palletsprojects.com) is a micro-framework to build web application with Python. This project would be suitable for someone who is developing som analysis tool within the Python ecosystem and would like to create a dashboard to showcase their findings. In this series, I will focus on a financial dashboard but the ideas could easily extend to a variety of scenarios.

The series will be split into three parts:

1. Create the skeleton of our project :skull:
2. Pump in the market data and create a chart :bar_chart:
3. Make our dashboard look cool by adding some reactivity :sunglasses:

This is **_not_** a tutorial series on Flask itself, I am assuming the reader to have some familiarity with Flask. If you have no idea what Flask is or have little experience with Flask, I would suggest to have a look at this tutorial series by [Hackes and Slackers](https://hackersandslackers.com/series/build-flask-apps/). This is one of my favorite tutorials about Flask.

Let's dive in!

## Project setup

We will be using **poetry** to manage our package dependencies. For those who are not familiar with poetry, it is an excellent package designed to make it easier to track and manage the packages we will use in this project. It is somewhat similar to virtual environments, but I find its CLI interface and the way we can identify our dependencies incredibly easy to use. If you want to read more about poetry, you can check the official [documentation](https://python-poetry.org/docs/basic-usage/).

You can get poetry directly from PyPi with `pip`.

<figure>

```bash
pip install poetry
```

<figcaption>
    Installing poetry
</figcaption>
</figure>

Now that poetry is installed, let's configure our project folder structure.

1. Create a folder called **flask-dashboard**
2. `cd` into the folder
3. In the terminal execute the command: `poetry init`

If everything went in correctly, you should be prompted at the terminal to configure your project. The question are straight-forward, there are just two of them which require attention. When asked if you wish to configure the **main dependencies** and the **dev dependencies**, choose **no**. We will be doing those manually instead.

Once you have answered all the question, you can simply type "yes" and a `pyproject.toml` file will be created within your folder. If you see this file, you're in the right track. :+1:

### Configuring poetry

Poetry automatically creates virtual environments for us, which is great. However, there's one thing I don't quite like about it. It creates them in a default folder, not in your project folder. If you want to inspect the environment or point your IDE to this environment (for example, if you are using VS Code), it is much easier if the environment is located in the same folder as your project.

To see where poetry stores the virtual environments in your machine, you can use the following command.

<figure>

```bash
poetry config --list
```

<figcaption>
    Finding default virtual environment folder
</figcaption>
</figure>

You should see an option called **virtualenvs.path**, that's where the environments are created. I like to change this behaviour, so I changed my configuration to always create the virtual environments where my project is. If you wish to do the same, you can run either of these commands. Note that by default the change is global. If you want to change to be local to your project, you have to tell poetry.

<figure>

```bash
poetry config virtualenvs.in-project true         # global configuration
poetry config virtualenvs.in-project true --local # local configuration
```

<figcaption>
    Tell poetry to create venvs in project folder
</figcaption>
</figure>

Now that this is out of the way, let's add our package dependencies. In our dashboard, I'd like to add a table and a chart. Tables in python are synonym of pandas, for plotting we will use matplotlib, and of course we need Flask!. We can add all of these to our project with a single line of code. In the terminal, enter this command

<figure>

```bash
poetry add flask pandas matplotlib
```

<figcaption>
    Adding main dependencies
</figcaption>
</figure>

and this will add the three packages to our dependencies. If you open your `pyproject.toml` file, you will see those there now.

You may also want to add _development_ dependencies to the project. These are the dependencies you need to have in order to write the code, but are not required for the application to run. For example, I like to use the [flake8](https://flake8.pycqa.org/) linter, which helps me a lot when writing Python although it is most certainly not required for our project. To install dev dependencies, you just need to append the _**dev**_ option in the command line.

<figure>

```bash
poetry add --dev flake8
```

<figcaption>
    Adding development dependencies
</figcaption>
</figure>

If you have been following along like me, your `pyproject.toml` file should be looking like this by now. Naturally, your Python and/or package versions may differ.

<figure>

```toml
[tool.poetry]
name = "flask-dashboard"
version = "0.1.0"
description = "Financial dashboard with Flask"
authors = ["Flask Coder <flask.awesome@youremail.com>"]
license = "MIT"

[tool.poetry.dependencies]
python = "^3.9"
Flask = "^1.1.2"
pandas = "^1.2.1"
matplotlib = "^3.3.3"

[tool.poetry.dev-dependencies]
flake8 = "^3.8.4"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

<figcaption>
    pyproject.toml
</figcaption>
</figure>

Note that you should also have a file called `poetry.lock`. This is file is used by poetry to install the necessary dependencies. You should commit both your `pyproject.toml` and `poetry.lock` files to source controls.

To finalise this section about poetry, what happens if your virtual environment is deleted or if you receive a `pyproject.toml` and a `poetry.lock` files? How do you install your dependencies? It could not be simpler.

Just run

<figure>

```bash
poetry install
```

<figcaption>
    Restore packages with pyproject.toml
</figcaption>
</figure>

and all of your dependencies will be restored. Yes, I know what you're thinking and you're right, poetry is awesome. There's a lot more what goes into poetry and how you can use it to its best. I would encourage to read the [project site](https://python-poetry.org) if you want to know more.

Now that our packages are ready to be used, let's build our dashboard.

## Building the dashboard

We will use the _Flask Application Factory_ pattern which to me is the best way to modularize our Flask application. You may be thinking: "What the hell is this?". There's a lot going on here, but to summarise you can think of that as: "let's use a function to return our application instead of using a global variable everywhere". You can read more about it [here](https://flask.palletsprojects.com/en/1.1.x/patterns/appfactories/) and [here](https://hackersandslackers.com/flask-application-factory/).

The main idea is to decouple the implementation of our application from the pages which compose our application. If down the line we have a great idea and would like to add to our dashboard, we should not need to rewrite the whole application. We need to be able to code the new feature in isolation and apply it to our dashboard without breaking any existing functionality. The Application Factory pattern allows us to do exactly that.

Here's how my folder structure looks like.

- app --- our application code
  - \_\_init\_\_.py --- init file
  - data.py --- handles the dashboard's data
  - index.py --- processes the home page, similar to index.html
  - util.py --- holds any code which will be commonly use across our app
  - static/ --- folder with our app's static files
    - styles.css --- css styling
  - templates/ --- folder with Flask's templates
    - index.html --- home page template
- main.py --- the application entry point

<p></p>

<figure>

```bash
.
├── app
│   ├── __init__.py
│   ├── data.py
│   ├── index.py
│   ├── static
│   │   └── styles.css
│   ├── templates
│   │   └── index.html
│   └── util.py
├── main.py
├── poetry.lock
├── pyproject.toml
```

<figcaption>
    Application's folder structure
</figcaption>
</figure>
