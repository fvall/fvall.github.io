---
title: Create a financial dashboard with Flask - Part 2
date: 2021-04-13
categories: python, flask
---

This is the second post of a three-part series of how to create a financial dashboard with Flask. If you missed the first post, you can check it out [here](https://www.felipevalladao.com/blog/flask-dashboard-1/). In the last post we created a skeleton financial dashboard with fake market data. We could see some potential, but without real data the dashboard is not very useful. Time to pump in some actual data.

## Adding real market data

There are a number of market data providers which give limited access for free. For example:

1. [Alpha Vantage](https://www.alphavantage.co/)
2. [Tiingo](https://www.tiingo.com/)
3. [Twelve Data](https://twelvedata.com/)

However, we are not going to use any of these. We are going to use the first data source I ever did any financial analysis while in university (ah the memories...). Today we will be using Yahoo Finance in our dashboard to show us useful market information. It's known Yahoo Finance has some issues, but for a simple personal dashboard it will suffice. However, you should probably consider alternatives if you are trading with real money as data issues can be very costly.

We will be using the `yfinance` package which implements functions to download data from Yahoo Finance. We can leverage the package to get the data for us and we will only need to pipe the data into our existing functions. We can't use the package if it is not installed, so the first step is to add it to our virtual environment with poetry.

<figure>

```bash
poetry add yfinance
```

<figcaption>
    Add package to our poetry virtual environment
</figcaption>
</figure>

Let's get some data. This new function will get data from Yahoo Finance and will later substitute our `fake_data` function in our dashboard.

<figure>

```python
import yfinance as yf

def get_price_data(symbols, start_date = None, end_date = None):

    if end_date is None:
        end_date = datetime.date.today()

    if start_date is None:
        start_date = end_date

    start_date = parse_date(start_date)
    end_date = parse_date(end_date)

    start_date += datetime.timedelta(days = 1) # YFinance API auto subtracts 1 day
    end_date += datetime.timedelta(days = 1)   # we want end_date to be inclusive

    data = yf.download(
        symbols,
        start = start_date,
        end = end_date,
        actions = True,
        group_by = 'ticker'
    )

    # - Format data

    data = (
        data
        .melt(var_name = ['symbol', 'field'], ignore_index = False)
        .reset_index()
        .pivot(['Date', 'symbol'], 'field', 'value')
        .reset_index()
        .pipe(
            lambda df: df.rename(
                columns = {col : col.lower().replace(" ", "_") for col in df.columns}
            )
        )
        .sort_values('date', ascending = False)
    )

    return data
```

<figcaption>
    Get data from Yahoo Finance --- data.py
</figcaption>
</figure>

This function should be written in our `data.py` file. There's nothing too special about it, just a few curve balls the `yfinance` api throw at us which I mentioned in the comments. The variable `symbols` are the Yahoo symbols we will get the data for.

Because we are manipulating dates, it is much easier if we work with `datetime` objects instead of strings. However, sometimes is more convenient to pass dates as strings if we quickly working in the console. To do this effectively, the code above uses a `parse_date` function which translates strings into dates. We have not written this function yet, let's do it now.

## Parsing dates

Parsing dates is a simple task with the datetime module. If you have never done it, you can check the documentation [here](https://docs.python.org/3/library/datetime.html#datetime.datetime.strptime) but probably is very similar to other programming language you may have worked with. So, why do we need to write a specific function parse the dates?

Well, we don't, but we can it make a bit easier to work with. One thing that annoys me when dealing with dates and strings is to remember the date format. I will adopt the convention the date will be provided in the YEAR, MONTH, DAY format. However, I see a lot of date strings which are similar but still require different date format. For example:

- 2021-04-01
- 2021/04/01
- 2021_04_01

All of these have years followed by months, followed by days. It would be nice if we could write a function which parse all of these cases. And that's exactly what our `parse_date` function will do. Its purpose is simply to give more flexibility when working with dates.

<figure>

```python
import re

def parse_date(date):

    if isinstance(date, datetime.datetime):
        return date.date()

    if isinstance(date, datetime.date):
        return date

    if isinstance(date, str):
        date = re.sub(r'[-_/]', '', date)
        date = datetime.datetime.strptime(date, "%Y%m%d")
        return date.date()

    raise TypeError(f"Cannot parse_date for type {type(date).__name__}")
```

<figcaption>
    parse_date --- data.py
</figcaption>
</figure>

If the object `date` is already a date object, we return it. If it is a `datetime` object, we strip the time from it. Else, we use a regular expression to remove dashes, underscores or slashes.

Now we can parse all of these date combinations.

<figure>

```python
assert parse_date(20210401)   == datetime.date(2021,4,1)
assert parse_date(2021-04-01) == datetime.date(2021,4,1)
assert parse_date(2021_04_01) == datetime.date(2021,4,1)
assert parse_date(2021/04/01) == datetime.date(2021,4,1)
assert parse_date(2021_04/01) == datetime.date(2021,4,1)
assert parse_date(2021/04-01) == datetime.date(2021,4,1)
```

<figcaption>
    parsing dates
</figcaption>
</figure>
