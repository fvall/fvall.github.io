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

## Calculating returns

Let's create a helper function to calculate N-day returns. This will come in handy when plotting our data.

<figure>

```python
def calc_return(price_data, index = 1):

    if index < 1:
        raise ValueError("index must be greater than zero")

    def ret(pr, index):

        last  = pr['date'].iloc[0]
        first = pr['date'].iloc[min(index, len(pr))]
        df = pr.loc[pr['date'].isin([last, first])]

        return (
            df.loc[:, ['date', 'symbol', 'adj_close']]
            .pivot('symbol', 'date', 'adj_close')
            .assign(
                ret  = lambda df: df[last] / df[first] - 1,
                date = last
            )
        )

    df = pd.concat(
        [ret(tbl, index) for _, tbl in price_data.groupby('symbol')],
        sort = False
    )

    return df[['date', 'ret']]
```

<figcaption>
    calculating returns
</figcaption>
</figure>

Calculating returns is straight-forward, but in this case we are taking extra care to make sure we are computing it with the correct dates. This is specially important when dealing with assets from different regions and time zones. For example, Japanese and US equities. It is possible the data provider has already obtained the close prices for Japan while the US is still trading. In this case we can have a date mismatch in our calculation.

We solve this by creating an inner function (in the case above `ret`) and applying the calculation for each symbol. As a side bonus, this also takes care of holidays in case we are running for a date in which it is a holiday in one region but not in the other.

## Data.py

Now our data.py file should be complete. If you have been following along, it should like [this](https://github.com/fvall/flask-dashboard/blob/part2/app/data.py). Next, we will update our front-end.

## Updating our dashboard

Time to pump the market data to our dashboard. First we need to define which symbols we will display in our dashboard. I will use 5 ETFs:

1. [SPY](https://finance.yahoo.com/quote/SPY)
2. [EZU](https://finance.yahoo.com/quote/EZU)
3. [IWM](https://finance.yahoo.com/quote/IWM)
4. [EWJ](https://finance.yahoo.com/quote/EWJ)
5. [EEM](https://finance.yahoo.com/quote/EEM)

Next we need to define how many days we will display the data for. In my case I will display the last 90 days of data. To simply, I am defining the data extraction in the `home` function in our `index.py` file.

<figure>

```python

# All the previous imports go here...

from .data import get_price_data

@app.route("/")
def home():

    symbols = ['SPY', 'EZU', 'IWM', 'EWJ', 'EEM']
    end = datetime.date.today()
    start = end - datetime.timedelta(days = 30 * 3)

    df = get_price_data(symbols, start_date = start, end_date = end)

    # More continues below
    # ...
```

<figcaption>
    data definition --- index.py
</figcaption>
</figure>

However, 90 days of ETF prices would be too much data to show in our table. Let's summarise the results in our table to display only some useful metrics about our data.

### Updating our table

Instead of displaying all the ETF prices, let's display only the:

- most recent price
- most recent return
- the monthly return

This will give us a brief and yet meaningful summary about our ETFs. If we wish to analyse the performance over the entire 90 days, we can do so by analysing the chart. To do so, we will use our helper function `calc_return` which we created above.

<figure>

```python

# All the previous imports go here...

from .data import get_price_data
from .data import calc_return

@app.route("/")
def home():

    symbols = ['SPY', 'EZU', 'IWM', 'EWJ', 'EEM']
    end = datetime.date.today()
    start = end - datetime.timedelta(days = 30 * 3)

    df = get_price_data(symbols, start_date = start, end_date = end)

    ret_d01 = calc_return(df, index = 1)
    ret_d21 = calc_return(df, index = 21)
    prices  = (
        df[['symbol', 'date', 'adj_close']]
        .rename(
            columns = {'adj_close' : 'price'}
        )
        .merge(ret_d01.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'daily_return'})
        .merge(ret_d21.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'monthly_return'})
    )

    # More continues below
    # ...
```

<figcaption>
    summarising price data --- index.py
</figcaption>
</figure>

Above I am using the convention that a month has 21 business days, feel free to change it to suit your needs. Because we had already done the heavy lifting with `calc_return`, we just need to use our helper function and do some data manipulation to make it look nice.

Alright, things are looking good but our table is a bit dull. Let's style it a bit. Pandas provides some incredible styling options to customize our HTML table. This series is not about pandas, so I will not go in depth about how to customize the HTML table. I encourage you to check our the [documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/style.html) and all the amazing things you could do with it.

I will style the table as follows:

- positive returns show in green
- negative returns show in red
- add a percent symbol to returns
- style numbers with 2 decimal places

Our final version of the table looks like this.

<figure>

```python

# All the previous imports go here...

from .data import get_price_data
from .data import calc_return

@app.route("/")
def home():

    symbols = ['SPY', 'EZU', 'IWM', 'EWJ', 'EEM']
    end = datetime.date.today()
    start = end - datetime.timedelta(days = 30 * 3)

    df = get_price_data(symbols, start_date = start, end_date = end)
    _plot = (
        df
        .loc[:, ['date', 'symbol', 'adj_close']]
        .pivot('date', 'symbol', 'adj_close')
        .pipe(plot)
    )
    _plot = customize_chart(_plot)

    try:
        chart = export_svg(_plot)
    finally:
        plt.close()

    ret_d01 = calc_return(df, index = 1)
    ret_d21 = calc_return(df, index = 21)
    prices  = (
        df[['symbol', 'date', 'adj_close']]
        .rename(
            columns = {'adj_close' : 'price'}
        )
        .merge(ret_d01.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'daily_return'})
        .merge(ret_d21.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'monthly_return'})
    )

    # - styling

    return_cols = ['daily_return', 'monthly_return']
    def ret_color(x):
        color = 'tomato' if x < 0 else 'lightgreen'
        return 'color: %s' % color

    prices = (
        prices
        .sort_values('monthly_return', ascending = False)
        .assign(date = lambda df: df['date'].dt.strftime("%Y-%m-%d"))
        .pipe(format_data_frame)
        .format("{:,.2f}", subset = ['price'])
        .applymap(ret_color, subset = return_cols)
        .format("{:+,.2%}", subset = return_cols)
    )

    return render_template(
        "index.html",
        prices = prices.render(),
        chart = chart.getvalue().decode('utf8')
    )
```

<figcaption>
    styling our table --- index.py
</figcaption>
</figure>

Now our table should be looking like this. Much nicer!

<style type="text/css">
  #T_78132_ {
    width: 100%;
    font-size: 0.9rem;
    margin: auto 0;
    display: table;
    border-collapse: collapse;
  }
  #T_78132_ th {
    padding: 2px 5px;
    text-align: center;
    border-top: solid 1px;
    border-bottom: solid 1px;
    color: white;
  }
  #T_78132_ td {
    padding: 2px 5px;
    text-align: center;
    font-size: 0.8rem;
  }
  #T_78132_ tr:nth-child(even) {
    background-color: #182c52;
  }
  #T_78132_ tr:nth-child(odd) {
    background-color: #00153D;
  }
  #T_78132_ tr:hover {
    background-color: #e0ebff;
    color: #00153d;
  }
  #T_78132_ tr:hover > td {
    background-color: #e0ebff;
    color: #00153d;
  }
  #T_78132_ tr:hover > th {
    background-color: #e0ebff;
    color: #00153d;
  }
  #T_78132_row0_col3,
  #T_78132_row1_col3,
  #T_78132_row2_col3,
  #T_78132_row3_col4,
  #T_78132_row4_col4 {
    color: tomato;
  }
  #T_78132_row0_col4,
  #T_78132_row1_col4,
  #T_78132_row2_col4,
  #T_78132_row3_col3,
  #T_78132_row4_col3 {
    color: lightgreen;
  }
</style>
<table id="T_78132_">
  <thead>
    <tr>
      <th class="col_heading level0 col0">symbol</th>
      <th class="col_heading level0 col1">date</th>
      <th class="col_heading level0 col2">price</th>
      <th class="col_heading level0 col3">daily_return</th>
      <th class="col_heading level0 col4">monthly_return</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id="T_78132_row0_col0" class="data row0 col0">SPY</td>
      <td id="T_78132_row0_col1" class="data row0 col1">2021-04-14</td>
      <td id="T_78132_row0_col2" class="data row0 col2">411.45</td>
      <td id="T_78132_row0_col3" class="data row0 col3">-0.34%</td>
      <td id="T_78132_row0_col4" class="data row0 col4">+4.13%</td>
    </tr>
    <tr>
      <td id="T_78132_row1_col0" class="data row1 col0">EZU</td>
      <td id="T_78132_row1_col1" class="data row1 col1">2021-04-14</td>
      <td id="T_78132_row1_col2" class="data row1 col2">48.07</td>
      <td id="T_78132_row1_col3" class="data row1 col3">-0.02%</td>
      <td id="T_78132_row1_col4" class="data row1 col4">+3.53%</td>
    </tr>
    <tr>
      <td id="T_78132_row2_col0" class="data row2 col0">EWJ</td>
      <td id="T_78132_row2_col1" class="data row2 col1">2021-04-14</td>
      <td id="T_78132_row2_col2" class="data row2 col2">69.55</td>
      <td id="T_78132_row2_col3" class="data row2 col3">-0.19%</td>
      <td id="T_78132_row2_col4" class="data row2 col4">+0.35%</td>
    </tr>
    <tr>
      <td id="T_78132_row3_col0" class="data row3 col0">EEM</td>
      <td id="T_78132_row3_col1" class="data row3 col1">2021-04-14</td>
      <td id="T_78132_row3_col2" class="data row3 col2">53.72</td>
      <td id="T_78132_row3_col3" class="data row3 col3">+0.51%</td>
      <td id="T_78132_row3_col4" class="data row3 col4">-0.74%</td>
    </tr>
    <tr>
      <td id="T_78132_row4_col0" class="data row4 col0">IWM</td>
      <td id="T_78132_row4_col1" class="data row4 col1">2021-04-14</td>
      <td id="T_78132_row4_col2" class="data row4 col2">223.32</td>
      <td id="T_78132_row4_col3" class="data row4 col3">+0.99%</td>
      <td id="T_78132_row4_col4" class="data row4 col4">-4.56%</td>
    </tr>
  </tbody>
</table>

### Updating our chart

The last step is to update our chart. We already have the skeleton ready, we only need to pass the correct data. I am also changing the y-axis to display the values in percentage terms. Like this, we can easily compare our ETFs relative performance over time.

Our final index.py file looks like this. Note I combined all the imports at the top to make it easier to read.

<figure>

```python

import datetime
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick # - needs this to customize y-axis
from flask import current_app, render_template
from .data import (
    calc_return,
    format_data_frame,
    get_price_data
)

from .util import css_variables
from io import BytesIO

app = current_app
matplotlib.use('Agg')


def plot(prices):

    prices = (
        prices
        .sort_index()
        .apply(np.log)
        .diff()
        .fillna(0.0)
        .cumsum()
        .apply(np.exp)
        .apply(lambda x: x - 1)
    )

    return prices.plot()


def export_svg(chart):
    output = BytesIO()
    chart.get_figure().savefig(output, format = "svg")
    return output


def customize_chart(chart):
    fig = plt.gcf()
    css = css_variables()

    fig.set_facecolor(css['color_1'])
    chart.set_xlabel(None)
    chart.set_ylabel("Cumulative return", color = css['color_2'])
    chart.tick_params(color = css['color_2'], labelcolor = css['color_2'], which = "both")
    chart.set_facecolor(css['color_1'])
    for s in chart.spines:
        chart.spines[s].set_color(css['color_2'])

    chart.yaxis.set_major_formatter(mtick.PercentFormatter(1.0)) # --- Y-axis in percentage terms
    return chart


@app.route("/")
def home():

    symbols = ['SPY', 'EZU', 'IWM', 'EWJ', 'EEM']
    end = datetime.date.today()
    start = end - datetime.timedelta(days = 30 * 3)

    df = get_price_data(symbols, start_date = start, end_date = end)

    # --- pass our new data to our plot

    _plot = (
        df
        .loc[:, ['date', 'symbol', 'adj_close']]
        .pivot('date', 'symbol', 'adj_close')
        .pipe(plot)
    )
    _plot = customize_chart(_plot)

    try:
        chart = export_svg(_plot)
    finally:
        plt.close()

    ret_d01 = calc_return(df, index = 1)
    ret_d21 = calc_return(df, index = 21)
    prices  = (
        df[['symbol', 'date', 'adj_close']]
        .rename(
            columns = {'adj_close' : 'price'}
        )
        .merge(ret_d01.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'daily_return'})
        .merge(ret_d21.reset_index(), how = 'inner', on = ['date', 'symbol'])
        .rename(columns = {'ret' : 'monthly_return'})
    )

    # - styling

    return_cols = ['daily_return', 'monthly_return']
    def ret_color(x):
        color = 'tomato' if x < 0 else 'lightgreen'
        return 'color: %s' % color

    prices = (
        prices
        .sort_values('monthly_return', ascending = False)
        .assign(date = lambda df: df['date'].dt.strftime("%Y-%m-%d"))
        .pipe(format_data_frame)
        .format("{:,.2f}", subset = ['price'])
        .applymap(ret_color, subset = return_cols)
        .format("{:+,.2%}", subset = return_cols)
    )

    return render_template(
        "index.html",
        prices = prices.render(),
        chart = chart.getvalue().decode('utf8')
    )

```

<figcaption>
    final index.py
</figcaption>
</figure>

Now our chart is looking like the example below.

<!-- Created with matplotlib (https://matplotlib.org/) -->
<svg height="75%" version="1.1" viewBox="0 0 460.8 345.6" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <metadata>
  <rdf:RDF xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
   <cc:Work>
    <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
    <dc:date>2021-04-14T22:13:36.467247</dc:date>
    <dc:format>image/svg+xml</dc:format>
    <dc:creator>
     <cc:Agent>
      <dc:title>Matplotlib v3.3.3, https://matplotlib.org/</dc:title>
     </cc:Agent>
    </dc:creator>
   </cc:Work>
  </rdf:RDF>
 </metadata>
 <defs>
  <style type="text/css">*{stroke-linecap:butt;stroke-linejoin:round;}</style>
 </defs>
 <g id="figure_1">
  <g id="patch_1">
   <path d="M 0 345.6 
L 460.8 345.6 
L 460.8 0 
L 0 0 
z
" style="fill:#00153d;"/>
  </g>
  <g id="axes_1">
   <g id="patch_2">
    <path d="M 57.6 276.48 
L 414.72 276.48 
L 414.72 41.472 
L 57.6 41.472 
z
" style="fill:#00153d;"/>
   </g>
   <g id="matplotlib.axis_1">
    <g id="xtick_1">
     <g id="line2d_1">
      <defs>
       <path d="M 0 0 
L 0 3.5 
" id="ma8346eca97" style="stroke:#e0ebff;stroke-width:0.8;"/>
      </defs>
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="73.832727" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_1">
      <!-- 2021-01-15 -->
      <g style="fill:#e0ebff;" transform="translate(22.463276 319.118252)rotate(-30)scale(0.1 -0.1)">
       <defs>
        <path d="M 19.1875 8.296875 
L 53.609375 8.296875 
L 53.609375 0 
L 7.328125 0 
L 7.328125 8.296875 
Q 12.9375 14.109375 22.625 23.890625 
Q 32.328125 33.6875 34.8125 36.53125 
Q 39.546875 41.84375 41.421875 45.53125 
Q 43.3125 49.21875 43.3125 52.78125 
Q 43.3125 58.59375 39.234375 62.25 
Q 35.15625 65.921875 28.609375 65.921875 
Q 23.96875 65.921875 18.8125 64.3125 
Q 13.671875 62.703125 7.8125 59.421875 
L 7.8125 69.390625 
Q 13.765625 71.78125 18.9375 73 
Q 24.125 74.21875 28.421875 74.21875 
Q 39.75 74.21875 46.484375 68.546875 
Q 53.21875 62.890625 53.21875 53.421875 
Q 53.21875 48.921875 51.53125 44.890625 
Q 49.859375 40.875 45.40625 35.40625 
Q 44.1875 33.984375 37.640625 27.21875 
Q 31.109375 20.453125 19.1875 8.296875 
z
" id="DejaVuSans-50"/>
        <path d="M 31.78125 66.40625 
Q 24.171875 66.40625 20.328125 58.90625 
Q 16.5 51.421875 16.5 36.375 
Q 16.5 21.390625 20.328125 13.890625 
Q 24.171875 6.390625 31.78125 6.390625 
Q 39.453125 6.390625 43.28125 13.890625 
Q 47.125 21.390625 47.125 36.375 
Q 47.125 51.421875 43.28125 58.90625 
Q 39.453125 66.40625 31.78125 66.40625 
z
M 31.78125 74.21875 
Q 44.046875 74.21875 50.515625 64.515625 
Q 56.984375 54.828125 56.984375 36.375 
Q 56.984375 17.96875 50.515625 8.265625 
Q 44.046875 -1.421875 31.78125 -1.421875 
Q 19.53125 -1.421875 13.0625 8.265625 
Q 6.59375 17.96875 6.59375 36.375 
Q 6.59375 54.828125 13.0625 64.515625 
Q 19.53125 74.21875 31.78125 74.21875 
z
" id="DejaVuSans-48"/>
        <path d="M 12.40625 8.296875 
L 28.515625 8.296875 
L 28.515625 63.921875 
L 10.984375 60.40625 
L 10.984375 69.390625 
L 28.421875 72.90625 
L 38.28125 72.90625 
L 38.28125 8.296875 
L 54.390625 8.296875 
L 54.390625 0 
L 12.40625 0 
z
" id="DejaVuSans-49"/>
        <path d="M 4.890625 31.390625 
L 31.203125 31.390625 
L 31.203125 23.390625 
L 4.890625 23.390625 
z
" id="DejaVuSans-45"/>
        <path d="M 10.796875 72.90625 
L 49.515625 72.90625 
L 49.515625 64.59375 
L 19.828125 64.59375 
L 19.828125 46.734375 
Q 21.96875 47.46875 24.109375 47.828125 
Q 26.265625 48.1875 28.421875 48.1875 
Q 40.625 48.1875 47.75 41.5 
Q 54.890625 34.8125 54.890625 23.390625 
Q 54.890625 11.625 47.5625 5.09375 
Q 40.234375 -1.421875 26.90625 -1.421875 
Q 22.3125 -1.421875 17.546875 -0.640625 
Q 12.796875 0.140625 7.71875 1.703125 
L 7.71875 11.625 
Q 12.109375 9.234375 16.796875 8.0625 
Q 21.484375 6.890625 26.703125 6.890625 
Q 35.15625 6.890625 40.078125 11.328125 
Q 45.015625 15.765625 45.015625 23.390625 
Q 45.015625 31 40.078125 35.4375 
Q 35.15625 39.890625 26.703125 39.890625 
Q 22.75 39.890625 18.8125 39.015625 
Q 14.890625 38.140625 10.796875 36.28125 
z
" id="DejaVuSans-53"/>
       </defs>
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-49"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-49"/>
       <use x="517.529297" xlink:href="#DejaVuSans-53"/>
      </g>
     </g>
    </g>
    <g id="xtick_2">
     <g id="line2d_2">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="135.845393" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_2">
      <!-- 2021-02-01 -->
      <g style="fill:#e0ebff;" transform="translate(84.475942 319.118252)rotate(-30)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-50"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-48"/>
       <use x="517.529297" xlink:href="#DejaVuSans-49"/>
      </g>
     </g>
    </g>
    <g id="xtick_3">
     <g id="line2d_3">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="186.914648" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_3">
      <!-- 2021-02-15 -->
      <g style="fill:#e0ebff;" transform="translate(135.545196 319.118252)rotate(-30)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-50"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-49"/>
       <use x="517.529297" xlink:href="#DejaVuSans-53"/>
      </g>
     </g>
    </g>
    <g id="xtick_4">
     <g id="line2d_4">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="237.983902" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_4">
      <!-- 2021-03-01 -->
      <g style="fill:#e0ebff;" transform="translate(186.614451 319.118252)rotate(-30)scale(0.1 -0.1)">
       <defs>
        <path d="M 40.578125 39.3125 
Q 47.65625 37.796875 51.625 33 
Q 55.609375 28.21875 55.609375 21.1875 
Q 55.609375 10.40625 48.1875 4.484375 
Q 40.765625 -1.421875 27.09375 -1.421875 
Q 22.515625 -1.421875 17.65625 -0.515625 
Q 12.796875 0.390625 7.625 2.203125 
L 7.625 11.71875 
Q 11.71875 9.328125 16.59375 8.109375 
Q 21.484375 6.890625 26.8125 6.890625 
Q 36.078125 6.890625 40.9375 10.546875 
Q 45.796875 14.203125 45.796875 21.1875 
Q 45.796875 27.640625 41.28125 31.265625 
Q 36.765625 34.90625 28.71875 34.90625 
L 20.21875 34.90625 
L 20.21875 43.015625 
L 29.109375 43.015625 
Q 36.375 43.015625 40.234375 45.921875 
Q 44.09375 48.828125 44.09375 54.296875 
Q 44.09375 59.90625 40.109375 62.90625 
Q 36.140625 65.921875 28.71875 65.921875 
Q 24.65625 65.921875 20.015625 65.03125 
Q 15.375 64.15625 9.8125 62.3125 
L 9.8125 71.09375 
Q 15.4375 72.65625 20.34375 73.4375 
Q 25.25 74.21875 29.59375 74.21875 
Q 40.828125 74.21875 47.359375 69.109375 
Q 53.90625 64.015625 53.90625 55.328125 
Q 53.90625 49.265625 50.4375 45.09375 
Q 46.96875 40.921875 40.578125 39.3125 
z
" id="DejaVuSans-51"/>
       </defs>
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-51"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-48"/>
       <use x="517.529297" xlink:href="#DejaVuSans-49"/>
      </g>
     </g>
    </g>
    <g id="xtick_5">
     <g id="line2d_5">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="289.053156" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_5">
      <!-- 2021-03-15 -->
      <g style="fill:#e0ebff;" transform="translate(237.683705 319.118252)rotate(-30)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-51"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-49"/>
       <use x="517.529297" xlink:href="#DejaVuSans-53"/>
      </g>
     </g>
    </g>
    <g id="xtick_6">
     <g id="line2d_6">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="351.065822" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_6">
      <!-- 2021-04-01 -->
      <g style="fill:#e0ebff;" transform="translate(299.696371 319.118252)rotate(-30)scale(0.1 -0.1)">
       <defs>
        <path d="M 37.796875 64.3125 
L 12.890625 25.390625 
L 37.796875 25.390625 
z
M 35.203125 72.90625 
L 47.609375 72.90625 
L 47.609375 25.390625 
L 58.015625 25.390625 
L 58.015625 17.1875 
L 47.609375 17.1875 
L 47.609375 0 
L 37.796875 0 
L 37.796875 17.1875 
L 4.890625 17.1875 
L 4.890625 26.703125 
z
" id="DejaVuSans-52"/>
       </defs>
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-52"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-48"/>
       <use x="517.529297" xlink:href="#DejaVuSans-49"/>
      </g>
     </g>
    </g>
    <g id="xtick_7">
     <g id="line2d_7">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="402.135077" xlink:href="#ma8346eca97" y="276.48"/>
      </g>
     </g>
     <g id="text_7">
      <!-- 2021-04-15 -->
      <g style="fill:#e0ebff;" transform="translate(350.765625 319.118252)rotate(-30)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-50"/>
       <use x="190.869141" xlink:href="#DejaVuSans-49"/>
       <use x="254.492188" xlink:href="#DejaVuSans-45"/>
       <use x="290.576172" xlink:href="#DejaVuSans-48"/>
       <use x="354.199219" xlink:href="#DejaVuSans-52"/>
       <use x="417.822266" xlink:href="#DejaVuSans-45"/>
       <use x="453.90625" xlink:href="#DejaVuSans-49"/>
       <use x="517.529297" xlink:href="#DejaVuSans-53"/>
      </g>
     </g>
    </g>
   </g>
   <g id="matplotlib.axis_2">
    <g id="ytick_1">
     <g id="line2d_8">
      <defs>
       <path d="M 0 0 
L -3.5 0 
" id="mb19b43cbb2" style="stroke:#e0ebff;stroke-width:0.8;"/>
      </defs>
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="253.72075"/>
      </g>
     </g>
     <g id="text_8">
      <!-- −4.0% -->
      <g style="fill:#e0ebff;" transform="translate(16.815625 257.519969)scale(0.1 -0.1)">
       <defs>
        <path d="M 10.59375 35.5 
L 73.1875 35.5 
L 73.1875 27.203125 
L 10.59375 27.203125 
z
" id="DejaVuSans-8722"/>
        <path d="M 10.6875 12.40625 
L 21 12.40625 
L 21 0 
L 10.6875 0 
z
" id="DejaVuSans-46"/>
        <path d="M 72.703125 32.078125 
Q 68.453125 32.078125 66.03125 28.46875 
Q 63.625 24.859375 63.625 18.40625 
Q 63.625 12.0625 66.03125 8.421875 
Q 68.453125 4.78125 72.703125 4.78125 
Q 76.859375 4.78125 79.265625 8.421875 
Q 81.6875 12.0625 81.6875 18.40625 
Q 81.6875 24.8125 79.265625 28.4375 
Q 76.859375 32.078125 72.703125 32.078125 
z
M 72.703125 38.28125 
Q 80.421875 38.28125 84.953125 32.90625 
Q 89.5 27.546875 89.5 18.40625 
Q 89.5 9.28125 84.9375 3.921875 
Q 80.375 -1.421875 72.703125 -1.421875 
Q 64.890625 -1.421875 60.34375 3.921875 
Q 55.8125 9.28125 55.8125 18.40625 
Q 55.8125 27.59375 60.375 32.9375 
Q 64.9375 38.28125 72.703125 38.28125 
z
M 22.3125 68.015625 
Q 18.109375 68.015625 15.6875 64.375 
Q 13.28125 60.75 13.28125 54.390625 
Q 13.28125 47.953125 15.671875 44.328125 
Q 18.0625 40.71875 22.3125 40.71875 
Q 26.5625 40.71875 28.96875 44.328125 
Q 31.390625 47.953125 31.390625 54.390625 
Q 31.390625 60.6875 28.953125 64.34375 
Q 26.515625 68.015625 22.3125 68.015625 
z
M 66.40625 74.21875 
L 74.21875 74.21875 
L 28.609375 -1.421875 
L 20.796875 -1.421875 
z
M 22.3125 74.21875 
Q 30.03125 74.21875 34.609375 68.875 
Q 39.203125 63.53125 39.203125 54.390625 
Q 39.203125 45.171875 34.640625 39.84375 
Q 30.078125 34.515625 22.3125 34.515625 
Q 14.546875 34.515625 10.03125 39.859375 
Q 5.515625 45.21875 5.515625 54.390625 
Q 5.515625 63.484375 10.046875 68.84375 
Q 14.59375 74.21875 22.3125 74.21875 
z
" id="DejaVuSans-37"/>
       </defs>
       <use xlink:href="#DejaVuSans-8722"/>
       <use x="83.789062" xlink:href="#DejaVuSans-52"/>
       <use x="147.412109" xlink:href="#DejaVuSans-46"/>
       <use x="179.199219" xlink:href="#DejaVuSans-48"/>
       <use x="242.822266" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_2">
     <g id="line2d_9">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="227.253372"/>
      </g>
     </g>
     <g id="text_9">
      <!-- −2.0% -->
      <g style="fill:#e0ebff;" transform="translate(16.815625 231.05259)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-8722"/>
       <use x="83.789062" xlink:href="#DejaVuSans-50"/>
       <use x="147.412109" xlink:href="#DejaVuSans-46"/>
       <use x="179.199219" xlink:href="#DejaVuSans-48"/>
       <use x="242.822266" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_3">
     <g id="line2d_10">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="200.785993"/>
      </g>
     </g>
     <g id="text_10">
      <!-- 0.0% -->
      <g style="fill:#e0ebff;" transform="translate(25.195312 204.585212)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-48"/>
       <use x="63.623047" xlink:href="#DejaVuSans-46"/>
       <use x="95.410156" xlink:href="#DejaVuSans-48"/>
       <use x="159.033203" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_4">
     <g id="line2d_11">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="174.318615"/>
      </g>
     </g>
     <g id="text_11">
      <!-- 2.0% -->
      <g style="fill:#e0ebff;" transform="translate(25.195312 178.117834)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-50"/>
       <use x="63.623047" xlink:href="#DejaVuSans-46"/>
       <use x="95.410156" xlink:href="#DejaVuSans-48"/>
       <use x="159.033203" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_5">
     <g id="line2d_12">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="147.851237"/>
      </g>
     </g>
     <g id="text_12">
      <!-- 4.0% -->
      <g style="fill:#e0ebff;" transform="translate(25.195312 151.650456)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-52"/>
       <use x="63.623047" xlink:href="#DejaVuSans-46"/>
       <use x="95.410156" xlink:href="#DejaVuSans-48"/>
       <use x="159.033203" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_6">
     <g id="line2d_13">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="121.383859"/>
      </g>
     </g>
     <g id="text_13">
      <!-- 6.0% -->
      <g style="fill:#e0ebff;" transform="translate(25.195312 125.183077)scale(0.1 -0.1)">
       <defs>
        <path d="M 33.015625 40.375 
Q 26.375 40.375 22.484375 35.828125 
Q 18.609375 31.296875 18.609375 23.390625 
Q 18.609375 15.53125 22.484375 10.953125 
Q 26.375 6.390625 33.015625 6.390625 
Q 39.65625 6.390625 43.53125 10.953125 
Q 47.40625 15.53125 47.40625 23.390625 
Q 47.40625 31.296875 43.53125 35.828125 
Q 39.65625 40.375 33.015625 40.375 
z
M 52.59375 71.296875 
L 52.59375 62.3125 
Q 48.875 64.0625 45.09375 64.984375 
Q 41.3125 65.921875 37.59375 65.921875 
Q 27.828125 65.921875 22.671875 59.328125 
Q 17.53125 52.734375 16.796875 39.40625 
Q 19.671875 43.65625 24.015625 45.921875 
Q 28.375 48.1875 33.59375 48.1875 
Q 44.578125 48.1875 50.953125 41.515625 
Q 57.328125 34.859375 57.328125 23.390625 
Q 57.328125 12.15625 50.6875 5.359375 
Q 44.046875 -1.421875 33.015625 -1.421875 
Q 20.359375 -1.421875 13.671875 8.265625 
Q 6.984375 17.96875 6.984375 36.375 
Q 6.984375 53.65625 15.1875 63.9375 
Q 23.390625 74.21875 37.203125 74.21875 
Q 40.921875 74.21875 44.703125 73.484375 
Q 48.484375 72.75 52.59375 71.296875 
z
" id="DejaVuSans-54"/>
       </defs>
       <use xlink:href="#DejaVuSans-54"/>
       <use x="63.623047" xlink:href="#DejaVuSans-46"/>
       <use x="95.410156" xlink:href="#DejaVuSans-48"/>
       <use x="159.033203" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_7">
     <g id="line2d_14">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="94.91648"/>
      </g>
     </g>
     <g id="text_14">
      <!-- 8.0% -->
      <g style="fill:#e0ebff;" transform="translate(25.195312 98.715699)scale(0.1 -0.1)">
       <defs>
        <path d="M 31.78125 34.625 
Q 24.75 34.625 20.71875 30.859375 
Q 16.703125 27.09375 16.703125 20.515625 
Q 16.703125 13.921875 20.71875 10.15625 
Q 24.75 6.390625 31.78125 6.390625 
Q 38.8125 6.390625 42.859375 10.171875 
Q 46.921875 13.96875 46.921875 20.515625 
Q 46.921875 27.09375 42.890625 30.859375 
Q 38.875 34.625 31.78125 34.625 
z
M 21.921875 38.8125 
Q 15.578125 40.375 12.03125 44.71875 
Q 8.5 49.078125 8.5 55.328125 
Q 8.5 64.0625 14.71875 69.140625 
Q 20.953125 74.21875 31.78125 74.21875 
Q 42.671875 74.21875 48.875 69.140625 
Q 55.078125 64.0625 55.078125 55.328125 
Q 55.078125 49.078125 51.53125 44.71875 
Q 48 40.375 41.703125 38.8125 
Q 48.828125 37.15625 52.796875 32.3125 
Q 56.78125 27.484375 56.78125 20.515625 
Q 56.78125 9.90625 50.3125 4.234375 
Q 43.84375 -1.421875 31.78125 -1.421875 
Q 19.734375 -1.421875 13.25 4.234375 
Q 6.78125 9.90625 6.78125 20.515625 
Q 6.78125 27.484375 10.78125 32.3125 
Q 14.796875 37.15625 21.921875 38.8125 
z
M 18.3125 54.390625 
Q 18.3125 48.734375 21.84375 45.5625 
Q 25.390625 42.390625 31.78125 42.390625 
Q 38.140625 42.390625 41.71875 45.5625 
Q 45.3125 48.734375 45.3125 54.390625 
Q 45.3125 60.0625 41.71875 63.234375 
Q 38.140625 66.40625 31.78125 66.40625 
Q 25.390625 66.40625 21.84375 63.234375 
Q 18.3125 60.0625 18.3125 54.390625 
z
" id="DejaVuSans-56"/>
       </defs>
       <use xlink:href="#DejaVuSans-56"/>
       <use x="63.623047" xlink:href="#DejaVuSans-46"/>
       <use x="95.410156" xlink:href="#DejaVuSans-48"/>
       <use x="159.033203" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_8">
     <g id="line2d_15">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="68.449102"/>
      </g>
     </g>
     <g id="text_15">
      <!-- 10.0% -->
      <g style="fill:#e0ebff;" transform="translate(18.832812 72.248321)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-49"/>
       <use x="63.623047" xlink:href="#DejaVuSans-48"/>
       <use x="127.246094" xlink:href="#DejaVuSans-46"/>
       <use x="159.033203" xlink:href="#DejaVuSans-48"/>
       <use x="222.65625" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="ytick_9">
     <g id="line2d_16">
      <g>
       <use style="fill:#e0ebff;stroke:#e0ebff;stroke-width:0.8;" x="57.6" xlink:href="#mb19b43cbb2" y="41.981724"/>
      </g>
     </g>
     <g id="text_16">
      <!-- 12.0% -->
      <g style="fill:#e0ebff;" transform="translate(18.832812 45.780943)scale(0.1 -0.1)">
       <use xlink:href="#DejaVuSans-49"/>
       <use x="63.623047" xlink:href="#DejaVuSans-50"/>
       <use x="127.246094" xlink:href="#DejaVuSans-46"/>
       <use x="159.033203" xlink:href="#DejaVuSans-48"/>
       <use x="222.65625" xlink:href="#DejaVuSans-37"/>
      </g>
     </g>
    </g>
    <g id="text_17">
     <!-- Cumulative return -->
     <g style="fill:#e0ebff;" transform="translate(10.735937 204.387719)rotate(-90)scale(0.1 -0.1)">
      <defs>
       <path d="M 64.40625 67.28125 
L 64.40625 56.890625 
Q 59.421875 61.53125 53.78125 63.8125 
Q 48.140625 66.109375 41.796875 66.109375 
Q 29.296875 66.109375 22.65625 58.46875 
Q 16.015625 50.828125 16.015625 36.375 
Q 16.015625 21.96875 22.65625 14.328125 
Q 29.296875 6.6875 41.796875 6.6875 
Q 48.140625 6.6875 53.78125 8.984375 
Q 59.421875 11.28125 64.40625 15.921875 
L 64.40625 5.609375 
Q 59.234375 2.09375 53.4375 0.328125 
Q 47.65625 -1.421875 41.21875 -1.421875 
Q 24.65625 -1.421875 15.125 8.703125 
Q 5.609375 18.84375 5.609375 36.375 
Q 5.609375 53.953125 15.125 64.078125 
Q 24.65625 74.21875 41.21875 74.21875 
Q 47.75 74.21875 53.53125 72.484375 
Q 59.328125 70.75 64.40625 67.28125 
z
" id="DejaVuSans-67"/>
       <path d="M 8.5 21.578125 
L 8.5 54.6875 
L 17.484375 54.6875 
L 17.484375 21.921875 
Q 17.484375 14.15625 20.5 10.265625 
Q 23.53125 6.390625 29.59375 6.390625 
Q 36.859375 6.390625 41.078125 11.03125 
Q 45.3125 15.671875 45.3125 23.6875 
L 45.3125 54.6875 
L 54.296875 54.6875 
L 54.296875 0 
L 45.3125 0 
L 45.3125 8.40625 
Q 42.046875 3.421875 37.71875 1 
Q 33.40625 -1.421875 27.6875 -1.421875 
Q 18.265625 -1.421875 13.375 4.4375 
Q 8.5 10.296875 8.5 21.578125 
z
M 31.109375 56 
z
" id="DejaVuSans-117"/>
       <path d="M 52 44.1875 
Q 55.375 50.25 60.0625 53.125 
Q 64.75 56 71.09375 56 
Q 79.640625 56 84.28125 50.015625 
Q 88.921875 44.046875 88.921875 33.015625 
L 88.921875 0 
L 79.890625 0 
L 79.890625 32.71875 
Q 79.890625 40.578125 77.09375 44.375 
Q 74.3125 48.1875 68.609375 48.1875 
Q 61.625 48.1875 57.5625 43.546875 
Q 53.515625 38.921875 53.515625 30.90625 
L 53.515625 0 
L 44.484375 0 
L 44.484375 32.71875 
Q 44.484375 40.625 41.703125 44.40625 
Q 38.921875 48.1875 33.109375 48.1875 
Q 26.21875 48.1875 22.15625 43.53125 
Q 18.109375 38.875 18.109375 30.90625 
L 18.109375 0 
L 9.078125 0 
L 9.078125 54.6875 
L 18.109375 54.6875 
L 18.109375 46.1875 
Q 21.1875 51.21875 25.484375 53.609375 
Q 29.78125 56 35.6875 56 
Q 41.65625 56 45.828125 52.96875 
Q 50 49.953125 52 44.1875 
z
" id="DejaVuSans-109"/>
       <path d="M 9.421875 75.984375 
L 18.40625 75.984375 
L 18.40625 0 
L 9.421875 0 
z
" id="DejaVuSans-108"/>
       <path d="M 34.28125 27.484375 
Q 23.390625 27.484375 19.1875 25 
Q 14.984375 22.515625 14.984375 16.5 
Q 14.984375 11.71875 18.140625 8.90625 
Q 21.296875 6.109375 26.703125 6.109375 
Q 34.1875 6.109375 38.703125 11.40625 
Q 43.21875 16.703125 43.21875 25.484375 
L 43.21875 27.484375 
z
M 52.203125 31.203125 
L 52.203125 0 
L 43.21875 0 
L 43.21875 8.296875 
Q 40.140625 3.328125 35.546875 0.953125 
Q 30.953125 -1.421875 24.3125 -1.421875 
Q 15.921875 -1.421875 10.953125 3.296875 
Q 6 8.015625 6 15.921875 
Q 6 25.140625 12.171875 29.828125 
Q 18.359375 34.515625 30.609375 34.515625 
L 43.21875 34.515625 
L 43.21875 35.40625 
Q 43.21875 41.609375 39.140625 45 
Q 35.0625 48.390625 27.6875 48.390625 
Q 23 48.390625 18.546875 47.265625 
Q 14.109375 46.140625 10.015625 43.890625 
L 10.015625 52.203125 
Q 14.9375 54.109375 19.578125 55.046875 
Q 24.21875 56 28.609375 56 
Q 40.484375 56 46.34375 49.84375 
Q 52.203125 43.703125 52.203125 31.203125 
z
" id="DejaVuSans-97"/>
       <path d="M 18.3125 70.21875 
L 18.3125 54.6875 
L 36.8125 54.6875 
L 36.8125 47.703125 
L 18.3125 47.703125 
L 18.3125 18.015625 
Q 18.3125 11.328125 20.140625 9.421875 
Q 21.96875 7.515625 27.59375 7.515625 
L 36.8125 7.515625 
L 36.8125 0 
L 27.59375 0 
Q 17.1875 0 13.234375 3.875 
Q 9.28125 7.765625 9.28125 18.015625 
L 9.28125 47.703125 
L 2.6875 47.703125 
L 2.6875 54.6875 
L 9.28125 54.6875 
L 9.28125 70.21875 
z
" id="DejaVuSans-116"/>
       <path d="M 9.421875 54.6875 
L 18.40625 54.6875 
L 18.40625 0 
L 9.421875 0 
z
M 9.421875 75.984375 
L 18.40625 75.984375 
L 18.40625 64.59375 
L 9.421875 64.59375 
z
" id="DejaVuSans-105"/>
       <path d="M 2.984375 54.6875 
L 12.5 54.6875 
L 29.59375 8.796875 
L 46.6875 54.6875 
L 56.203125 54.6875 
L 35.6875 0 
L 23.484375 0 
z
" id="DejaVuSans-118"/>
       <path d="M 56.203125 29.59375 
L 56.203125 25.203125 
L 14.890625 25.203125 
Q 15.484375 15.921875 20.484375 11.0625 
Q 25.484375 6.203125 34.421875 6.203125 
Q 39.59375 6.203125 44.453125 7.46875 
Q 49.3125 8.734375 54.109375 11.28125 
L 54.109375 2.78125 
Q 49.265625 0.734375 44.1875 -0.34375 
Q 39.109375 -1.421875 33.890625 -1.421875 
Q 20.796875 -1.421875 13.15625 6.1875 
Q 5.515625 13.8125 5.515625 26.8125 
Q 5.515625 40.234375 12.765625 48.109375 
Q 20.015625 56 32.328125 56 
Q 43.359375 56 49.78125 48.890625 
Q 56.203125 41.796875 56.203125 29.59375 
z
M 47.21875 32.234375 
Q 47.125 39.59375 43.09375 43.984375 
Q 39.0625 48.390625 32.421875 48.390625 
Q 24.90625 48.390625 20.390625 44.140625 
Q 15.875 39.890625 15.1875 32.171875 
z
" id="DejaVuSans-101"/>
       <path id="DejaVuSans-32"/>
       <path d="M 41.109375 46.296875 
Q 39.59375 47.171875 37.8125 47.578125 
Q 36.03125 48 33.890625 48 
Q 26.265625 48 22.1875 43.046875 
Q 18.109375 38.09375 18.109375 28.8125 
L 18.109375 0 
L 9.078125 0 
L 9.078125 54.6875 
L 18.109375 54.6875 
L 18.109375 46.1875 
Q 20.953125 51.171875 25.484375 53.578125 
Q 30.03125 56 36.53125 56 
Q 37.453125 56 38.578125 55.875 
Q 39.703125 55.765625 41.0625 55.515625 
z
" id="DejaVuSans-114"/>
       <path d="M 54.890625 33.015625 
L 54.890625 0 
L 45.90625 0 
L 45.90625 32.71875 
Q 45.90625 40.484375 42.875 44.328125 
Q 39.84375 48.1875 33.796875 48.1875 
Q 26.515625 48.1875 22.3125 43.546875 
Q 18.109375 38.921875 18.109375 30.90625 
L 18.109375 0 
L 9.078125 0 
L 9.078125 54.6875 
L 18.109375 54.6875 
L 18.109375 46.1875 
Q 21.34375 51.125 25.703125 53.5625 
Q 30.078125 56 35.796875 56 
Q 45.21875 56 50.046875 50.171875 
Q 54.890625 44.34375 54.890625 33.015625 
z
" id="DejaVuSans-110"/>
      </defs>
      <use xlink:href="#DejaVuSans-67"/>
      <use x="69.824219" xlink:href="#DejaVuSans-117"/>
      <use x="133.203125" xlink:href="#DejaVuSans-109"/>
      <use x="230.615234" xlink:href="#DejaVuSans-117"/>
      <use x="293.994141" xlink:href="#DejaVuSans-108"/>
      <use x="321.777344" xlink:href="#DejaVuSans-97"/>
      <use x="383.056641" xlink:href="#DejaVuSans-116"/>
      <use x="422.265625" xlink:href="#DejaVuSans-105"/>
      <use x="450.048828" xlink:href="#DejaVuSans-118"/>
      <use x="509.228516" xlink:href="#DejaVuSans-101"/>
      <use x="570.751953" xlink:href="#DejaVuSans-32"/>
      <use x="602.539062" xlink:href="#DejaVuSans-114"/>
      <use x="641.402344" xlink:href="#DejaVuSans-101"/>
      <use x="702.925781" xlink:href="#DejaVuSans-116"/>
      <use x="742.134766" xlink:href="#DejaVuSans-117"/>
      <use x="805.513672" xlink:href="#DejaVuSans-114"/>
      <use x="844.876953" xlink:href="#DejaVuSans-110"/>
     </g>
    </g>
   </g>
   <g id="line2d_17">
    <path clip-path="url(#pe9f9879c26)" d="M 73.832727 200.785993 
L 88.423943 178.871843 
L 92.071747 155.253269 
L 95.719551 152.818405 
L 99.367354 164.74937 
L 110.310766 154.522828 
L 113.95857 164.505921 
L 117.606374 202.246875 
L 121.254178 192.994316 
L 124.901982 226.108898 
L 135.845393 191.04635 
L 139.493197 173.758572 
L 143.141001 166.940785 
L 146.788805 166.453886 
L 150.436609 154.766278 
L 161.38002 152.331413 
L 165.027824 137.722042 
L 168.675628 132.85222 
L 172.323432 117.999306 
L 175.971236 116.781874 
L 190.562451 113.373027 
L 194.210255 112.886035 
L 197.858059 132.365229 
L 201.505863 123.356119 
L 212.449275 164.505921 
L 216.097079 158.418667 
L 219.744883 167.184327 
L 223.392686 198.107587 
L 227.04049 215.882357 
L 237.983902 180.819809 
L 241.631706 193.968206 
L 245.27951 196.646613 
L 248.927314 227.569872 
L 252.575117 213.447399 
L 263.518529 248.753489 
L 267.166333 220.752178 
L 270.814137 226.59589 
L 274.461941 185.689537 
L 278.109745 209.551561 
L 289.053156 206.386256 
L 292.70096 200.785993 
L 296.348764 199.08157 
L 299.996568 223.430585 
L 303.644372 207.360146 
L 314.587783 211.256077 
L 318.235587 236.335533 
L 321.883391 265.797818 
L 325.531195 259.954107 
L 329.178999 227.082881 
L 340.122411 236.09199 
L 343.770215 231.952703 
L 347.418018 225.378457 
L 351.065822 212.716959 
L 365.657038 207.603688 
L 369.304842 200.299002 
L 372.952646 219.778195 
L 376.600449 209.064662 
L 380.248253 220.265187 
L 391.191665 228.056864 
L 394.839469 222.700051 
L 398.487273 216.125806 
" style="fill:none;stroke:#1f77b4;stroke-linecap:square;stroke-width:1.5;"/>
   </g>
   <g id="line2d_18">
    <path clip-path="url(#pe9f9879c26)" d="M 73.832727 200.785993 
L 88.423943 193.083002 
L 92.071747 186.342939 
L 95.719551 191.542521 
L 99.367354 190.772207 
L 110.310766 185.572626 
L 113.95857 185.380157 
L 117.606374 214.651349 
L 121.254178 206.178043 
L 124.901982 234.101369 
L 135.845393 220.621097 
L 139.493197 210.222081 
L 143.141001 202.519236 
L 146.788805 200.978609 
L 150.436609 190.579592 
L 161.38002 166.700451 
L 165.027824 159.382543 
L 168.675628 161.886099 
L 172.323432 154.760807 
L 175.971236 146.287501 
L 190.562451 140.317753 
L 194.210255 142.243464 
L 197.858059 158.804844 
L 201.505863 150.331686 
L 212.449275 153.605409 
L 216.097079 156.686518 
L 219.744883 168.048463 
L 223.392686 191.349906 
L 227.04049 210.414696 
L 237.983902 188.653881 
L 241.631706 201.748922 
L 245.27951 209.644382 
L 248.927314 222.161725 
L 252.575117 211.570093 
L 263.518529 226.205763 
L 267.166333 211.955324 
L 270.814137 207.333588 
L 274.461941 213.881035 
L 278.109745 196.549341 
L 289.053156 189.424195 
L 292.70096 184.994927 
L 296.348764 176.329153 
L 299.996568 172.670199 
L 303.644372 162.848882 
L 314.587783 171.899886 
L 318.235587 192.12022 
L 321.883391 206.755742 
L 325.531195 191.734989 
L 329.178999 174.018212 
L 340.122411 182.106287 
L 343.770215 191.927605 
L 347.418018 204.637563 
L 351.065822 192.697918 
L 365.657038 176.521622 
L 369.304842 196.934571 
L 372.952646 193.083002 
L 376.600449 191.734989 
L 380.248253 182.491517 
L 391.191665 190.772207 
L 394.839469 182.298902 
L 398.487273 184.802312 
" style="fill:none;stroke:#ff7f0e;stroke-linecap:square;stroke-width:1.5;"/>
   </g>
   <g id="line2d_19">
    <path clip-path="url(#pe9f9879c26)" d="M 73.832727 200.785993 
L 88.423943 188.86382 
L 92.071747 181.710424 
L 95.719551 177.239652 
L 99.367354 186.777436 
L 110.310766 200.189981 
L 113.95857 191.248209 
L 117.606374 226.418832 
L 121.254178 209.429646 
L 124.901982 233.274108 
L 135.845393 217.179167 
L 139.493197 198.69961 
L 143.141001 196.315221 
L 146.788805 192.44046 
L 150.436609 180.816293 
L 161.38002 174.259023 
L 165.027824 170.682382 
L 168.675628 177.537658 
L 172.323432 166.211496 
L 175.971236 160.250466 
L 190.562451 153.395077 
L 194.210255 166.211496 
L 197.858059 169.490131 
L 201.505863 162.932975 
L 212.449275 166.807622 
L 216.097079 167.105741 
L 219.744883 153.991202 
L 223.392686 176.643526 
L 227.04049 189.459945 
L 237.983902 166.509616 
L 241.631706 164.721239 
L 245.27951 175.153269 
L 248.927314 188.267694 
L 252.575117 183.796808 
L 263.518529 180.816293 
L 267.166333 162.336849 
L 270.814137 149.52043 
L 274.461941 135.511759 
L 278.109745 136.704011 
L 289.053156 140.280651 
L 292.70096 142.665154 
L 296.348764 129.252609 
L 299.996568 146.241795 
L 303.644372 147.135927 
L 314.587783 143.559286 
L 318.235587 161.740723 
L 321.883391 164.721239 
L 325.531195 157.567957 
L 329.178999 138.790394 
L 340.122411 143.857292 
L 343.770215 139.982645 
L 347.418018 140.280651 
L 351.065822 117.032316 
L 365.657038 93.187854 
L 369.304842 107.792537 
L 372.952646 104.215896 
L 376.600449 98.254753 
L 380.248253 95.572244 
L 391.191665 101.533387 
L 394.839469 91.101357 
L 398.487273 91.399477 
" style="fill:none;stroke:#2ca02c;stroke-linecap:square;stroke-width:1.5;"/>
   </g>
   <g id="line2d_20">
    <path clip-path="url(#pe9f9879c26)" d="M 73.832727 200.785993 
L 88.423943 183.831807 
L 92.071747 177.92916 
L 95.719551 189.608796 
L 99.367354 174.098857 
L 110.310766 175.417543 
L 113.95857 184.773616 
L 117.606374 209.325819 
L 121.254178 213.533 
L 124.901982 233.37568 
L 135.845393 201.665021 
L 139.493197 182.827122 
L 143.141001 178.808284 
L 146.788805 151.367682 
L 150.436609 132.341344 
L 161.38002 96.800286 
L 165.027824 90.081296 
L 168.675628 99.500342 
L 172.323432 101.133027 
L 175.971236 97.114286 
L 190.562451 106.093674 
L 194.210255 117.20809 
L 197.858059 138.997361 
L 201.505863 110.112415 
L 212.449275 119.280242 
L 216.097079 131.650563 
L 219.744883 98.746876 
L 223.392686 151.430463 
L 227.04049 153.314272 
L 237.983902 104.58655 
L 241.631706 131.901686 
L 245.27951 146.972063 
L 248.927314 185.464397 
L 252.575117 157.081794 
L 263.518529 150.61412 
L 267.166333 121.729174 
L 270.814137 97.365409 
L 274.461941 65.96875 
L 278.109745 57.366047 
L 289.053156 52.154182 
L 292.70096 76.769166 
L 296.348764 65.403627 
L 299.996568 109.798415 
L 303.644372 99.123561 
L 314.587783 109.861292 
L 318.235587 161.163413 
L 321.883391 192.685633 
L 325.531195 161.116663 
L 329.178999 136.266682 
L 340.122411 175.334699 
L 343.770215 152.623683 
L 347.418018 134.190595 
L 351.065822 116.575386 
L 365.657038 108.837312 
L 369.304842 112.989486 
L 372.952646 135.76338 
L 376.600449 123.99898 
L 380.248253 123.810254 
L 391.191665 129.283514 
L 394.839469 132.932386 
L 398.487273 119.217653 
" style="fill:none;stroke:#d62728;stroke-linecap:square;stroke-width:1.5;"/>
   </g>
   <g id="line2d_21">
    <path clip-path="url(#pe9f9879c26)" d="M 73.832727 200.785993 
L 88.423943 190.394891 
L 92.071747 171.937447 
L 95.719551 170.704643 
L 99.367354 175.495119 
L 110.310766 170.17619 
L 113.95857 172.289677 
L 117.606374 205.32993 
L 121.254178 193.987721 
L 124.901982 220.617091 
L 135.845393 198.919046 
L 139.493197 180.179904 
L 143.141001 179.123215 
L 146.788805 163.835946 
L 150.436609 158.48186 
L 161.38002 148.619102 
L 165.027824 149.534943 
L 168.675628 150.13382 
L 172.323432 147.914643 
L 175.971236 141.116371 
L 190.562451 142.314017 
L 194.210255 141.996945 
L 197.858059 147.879376 
L 201.505863 150.309934 
L 212.449275 160.877151 
L 216.097079 159.221585 
L 219.744883 144.180964 
L 223.392686 177.43249 
L 227.04049 184.371611 
L 237.983902 151.894969 
L 241.631706 162.603034 
L 245.27951 180.637824 
L 248.927314 197.263588 
L 252.575117 172.853288 
L 263.518529 179.581135 
L 267.166333 160.383965 
L 270.814137 151.894969 
L 274.461941 137.981461 
L 278.109745 136.114621 
L 289.053156 127.836898 
L 292.70096 129.598155 
L 296.348764 124.842837 
L 299.996568 145.202387 
L 303.644372 147.753842 
L 314.587783 136.763324 
L 318.235587 147.683202 
L 321.883391 154.680453 
L 325.531195 146.97637 
L 329.178999 124.783197 
L 340.122411 125.49003 
L 343.770215 129.200629 
L 347.418018 123.546403 
L 351.065822 108.421121 
L 365.657038 88.100935 
L 369.304842 88.949048 
L 372.952646 87.288089 
L 376.600449 80.467601 
L 380.248253 69.971779 
L 391.191665 69.441601 
L 394.839469 65.130291 
L 398.487273 70.113059 
" style="fill:none;stroke:#9467bd;stroke-linecap:square;stroke-width:1.5;"/>
   </g>
   <g id="patch_3">
    <path d="M 57.6 276.48 
L 57.6 41.472 
" style="fill:none;stroke:#e0ebff;stroke-linecap:square;stroke-linejoin:miter;stroke-width:0.8;"/>
   </g>
   <g id="patch_4">
    <path d="M 414.72 276.48 
L 414.72 41.472 
" style="fill:none;stroke:#e0ebff;stroke-linecap:square;stroke-linejoin:miter;stroke-width:0.8;"/>
   </g>
   <g id="patch_5">
    <path d="M 57.6 276.48 
L 414.72 276.48 
" style="fill:none;stroke:#e0ebff;stroke-linecap:square;stroke-linejoin:miter;stroke-width:0.8;"/>
   </g>
   <g id="patch_6">
    <path d="M 57.6 41.472 
L 414.72 41.472 
" style="fill:none;stroke:#e0ebff;stroke-linecap:square;stroke-linejoin:miter;stroke-width:0.8;"/>
   </g>
   <g id="legend_1">
    <g id="patch_7">
     <path d="M 64.6 137.54075 
L 118.065625 137.54075 
Q 120.065625 137.54075 120.065625 135.54075 
L 120.065625 48.472 
Q 120.065625 46.472 118.065625 46.472 
L 64.6 46.472 
Q 62.6 46.472 62.6 48.472 
L 62.6 135.54075 
Q 62.6 137.54075 64.6 137.54075 
z
" style="fill:#ffffff;opacity:0.8;stroke:#cccccc;stroke-linejoin:miter;"/>
    </g>
    <g id="text_18">
     <!-- symbol -->
     <g transform="translate(73.275781 58.070437)scale(0.1 -0.1)">
      <defs>
       <path d="M 44.28125 53.078125 
L 44.28125 44.578125 
Q 40.484375 46.53125 36.375 47.5 
Q 32.28125 48.484375 27.875 48.484375 
Q 21.1875 48.484375 17.84375 46.4375 
Q 14.5 44.390625 14.5 40.28125 
Q 14.5 37.15625 16.890625 35.375 
Q 19.28125 33.59375 26.515625 31.984375 
L 29.59375 31.296875 
Q 39.15625 29.25 43.1875 25.515625 
Q 47.21875 21.78125 47.21875 15.09375 
Q 47.21875 7.46875 41.1875 3.015625 
Q 35.15625 -1.421875 24.609375 -1.421875 
Q 20.21875 -1.421875 15.453125 -0.5625 
Q 10.6875 0.296875 5.421875 2 
L 5.421875 11.28125 
Q 10.40625 8.6875 15.234375 7.390625 
Q 20.0625 6.109375 24.8125 6.109375 
Q 31.15625 6.109375 34.5625 8.28125 
Q 37.984375 10.453125 37.984375 14.40625 
Q 37.984375 18.0625 35.515625 20.015625 
Q 33.0625 21.96875 24.703125 23.78125 
L 21.578125 24.515625 
Q 13.234375 26.265625 9.515625 29.90625 
Q 5.8125 33.546875 5.8125 39.890625 
Q 5.8125 47.609375 11.28125 51.796875 
Q 16.75 56 26.8125 56 
Q 31.78125 56 36.171875 55.265625 
Q 40.578125 54.546875 44.28125 53.078125 
z
" id="DejaVuSans-115"/>
       <path d="M 32.171875 -5.078125 
Q 28.375 -14.84375 24.75 -17.8125 
Q 21.140625 -20.796875 15.09375 -20.796875 
L 7.90625 -20.796875 
L 7.90625 -13.28125 
L 13.1875 -13.28125 
Q 16.890625 -13.28125 18.9375 -11.515625 
Q 21 -9.765625 23.484375 -3.21875 
L 25.09375 0.875 
L 2.984375 54.6875 
L 12.5 54.6875 
L 29.59375 11.921875 
L 46.6875 54.6875 
L 56.203125 54.6875 
z
" id="DejaVuSans-121"/>
       <path d="M 48.6875 27.296875 
Q 48.6875 37.203125 44.609375 42.84375 
Q 40.53125 48.484375 33.40625 48.484375 
Q 26.265625 48.484375 22.1875 42.84375 
Q 18.109375 37.203125 18.109375 27.296875 
Q 18.109375 17.390625 22.1875 11.75 
Q 26.265625 6.109375 33.40625 6.109375 
Q 40.53125 6.109375 44.609375 11.75 
Q 48.6875 17.390625 48.6875 27.296875 
z
M 18.109375 46.390625 
Q 20.953125 51.265625 25.265625 53.625 
Q 29.59375 56 35.59375 56 
Q 45.5625 56 51.78125 48.09375 
Q 58.015625 40.1875 58.015625 27.296875 
Q 58.015625 14.40625 51.78125 6.484375 
Q 45.5625 -1.421875 35.59375 -1.421875 
Q 29.59375 -1.421875 25.265625 0.953125 
Q 20.953125 3.328125 18.109375 8.203125 
L 18.109375 0 
L 9.078125 0 
L 9.078125 75.984375 
L 18.109375 75.984375 
z
" id="DejaVuSans-98"/>
       <path d="M 30.609375 48.390625 
Q 23.390625 48.390625 19.1875 42.75 
Q 14.984375 37.109375 14.984375 27.296875 
Q 14.984375 17.484375 19.15625 11.84375 
Q 23.34375 6.203125 30.609375 6.203125 
Q 37.796875 6.203125 41.984375 11.859375 
Q 46.1875 17.53125 46.1875 27.296875 
Q 46.1875 37.015625 41.984375 42.703125 
Q 37.796875 48.390625 30.609375 48.390625 
z
M 30.609375 56 
Q 42.328125 56 49.015625 48.375 
Q 55.71875 40.765625 55.71875 27.296875 
Q 55.71875 13.875 49.015625 6.21875 
Q 42.328125 -1.421875 30.609375 -1.421875 
Q 18.84375 -1.421875 12.171875 6.21875 
Q 5.515625 13.875 5.515625 27.296875 
Q 5.515625 40.765625 12.171875 48.375 
Q 18.84375 56 30.609375 56 
z
" id="DejaVuSans-111"/>
      </defs>
      <use xlink:href="#DejaVuSans-115"/>
      <use x="52.099609" xlink:href="#DejaVuSans-121"/>
      <use x="111.279297" xlink:href="#DejaVuSans-109"/>
      <use x="208.691406" xlink:href="#DejaVuSans-98"/>
      <use x="272.167969" xlink:href="#DejaVuSans-111"/>
      <use x="333.349609" xlink:href="#DejaVuSans-108"/>
     </g>
    </g>
    <g id="line2d_22">
     <path d="M 66.6 69.248562 
L 86.6 69.248562 
" style="fill:none;stroke:#1f77b4;stroke-linecap:square;stroke-width:1.5;"/>
    </g>
    <g id="line2d_23"/>
    <g id="text_19">
     <!-- EEM -->
     <g transform="translate(94.6 72.748562)scale(0.1 -0.1)">
      <defs>
       <path d="M 9.8125 72.90625 
L 55.90625 72.90625 
L 55.90625 64.59375 
L 19.671875 64.59375 
L 19.671875 43.015625 
L 54.390625 43.015625 
L 54.390625 34.71875 
L 19.671875 34.71875 
L 19.671875 8.296875 
L 56.78125 8.296875 
L 56.78125 0 
L 9.8125 0 
z
" id="DejaVuSans-69"/>
       <path d="M 9.8125 72.90625 
L 24.515625 72.90625 
L 43.109375 23.296875 
L 61.8125 72.90625 
L 76.515625 72.90625 
L 76.515625 0 
L 66.890625 0 
L 66.890625 64.015625 
L 48.09375 14.015625 
L 38.1875 14.015625 
L 19.390625 64.015625 
L 19.390625 0 
L 9.8125 0 
z
" id="DejaVuSans-77"/>
      </defs>
      <use xlink:href="#DejaVuSans-69"/>
      <use x="63.183594" xlink:href="#DejaVuSans-69"/>
      <use x="126.367188" xlink:href="#DejaVuSans-77"/>
     </g>
    </g>
    <g id="line2d_24">
     <path d="M 66.6 83.926688 
L 86.6 83.926688 
" style="fill:none;stroke:#ff7f0e;stroke-linecap:square;stroke-width:1.5;"/>
    </g>
    <g id="line2d_25"/>
    <g id="text_20">
     <!-- EWJ -->
     <g transform="translate(94.6 87.426688)scale(0.1 -0.1)">
      <defs>
       <path d="M 3.328125 72.90625 
L 13.28125 72.90625 
L 28.609375 11.28125 
L 43.890625 72.90625 
L 54.984375 72.90625 
L 70.3125 11.28125 
L 85.59375 72.90625 
L 95.609375 72.90625 
L 77.296875 0 
L 64.890625 0 
L 49.515625 63.28125 
L 33.984375 0 
L 21.578125 0 
z
" id="DejaVuSans-87"/>
       <path d="M 9.8125 72.90625 
L 19.671875 72.90625 
L 19.671875 5.078125 
Q 19.671875 -8.109375 14.671875 -14.0625 
Q 9.671875 -20.015625 -1.421875 -20.015625 
L -5.171875 -20.015625 
L -5.171875 -11.71875 
L -2.09375 -11.71875 
Q 4.4375 -11.71875 7.125 -8.046875 
Q 9.8125 -4.390625 9.8125 5.078125 
z
" id="DejaVuSans-74"/>
      </defs>
      <use xlink:href="#DejaVuSans-69"/>
      <use x="63.183594" xlink:href="#DejaVuSans-87"/>
      <use x="162.060547" xlink:href="#DejaVuSans-74"/>
     </g>
    </g>
    <g id="line2d_26">
     <path d="M 66.6 98.604812 
L 86.6 98.604812 
" style="fill:none;stroke:#2ca02c;stroke-linecap:square;stroke-width:1.5;"/>
    </g>
    <g id="line2d_27"/>
    <g id="text_21">
     <!-- EZU -->
     <g transform="translate(94.6 102.104812)scale(0.1 -0.1)">
      <defs>
       <path d="M 5.609375 72.90625 
L 62.890625 72.90625 
L 62.890625 65.375 
L 16.796875 8.296875 
L 64.015625 8.296875 
L 64.015625 0 
L 4.5 0 
L 4.5 7.515625 
L 50.59375 64.59375 
L 5.609375 64.59375 
z
" id="DejaVuSans-90"/>
       <path d="M 8.6875 72.90625 
L 18.609375 72.90625 
L 18.609375 28.609375 
Q 18.609375 16.890625 22.84375 11.734375 
Q 27.09375 6.59375 36.625 6.59375 
Q 46.09375 6.59375 50.34375 11.734375 
Q 54.59375 16.890625 54.59375 28.609375 
L 54.59375 72.90625 
L 64.5 72.90625 
L 64.5 27.390625 
Q 64.5 13.140625 57.4375 5.859375 
Q 50.390625 -1.421875 36.625 -1.421875 
Q 22.796875 -1.421875 15.734375 5.859375 
Q 8.6875 13.140625 8.6875 27.390625 
z
" id="DejaVuSans-85"/>
      </defs>
      <use xlink:href="#DejaVuSans-69"/>
      <use x="63.183594" xlink:href="#DejaVuSans-90"/>
      <use x="131.689453" xlink:href="#DejaVuSans-85"/>
     </g>
    </g>
    <g id="line2d_28">
     <path d="M 66.6 113.282938 
L 86.6 113.282938 
" style="fill:none;stroke:#d62728;stroke-linecap:square;stroke-width:1.5;"/>
    </g>
    <g id="line2d_29"/>
    <g id="text_22">
     <!-- IWM -->
     <g transform="translate(94.6 116.782938)scale(0.1 -0.1)">
      <defs>
       <path d="M 9.8125 72.90625 
L 19.671875 72.90625 
L 19.671875 0 
L 9.8125 0 
z
" id="DejaVuSans-73"/>
      </defs>
      <use xlink:href="#DejaVuSans-73"/>
      <use x="29.492188" xlink:href="#DejaVuSans-87"/>
      <use x="128.369141" xlink:href="#DejaVuSans-77"/>
     </g>
    </g>
    <g id="line2d_30">
     <path d="M 66.6 127.961062 
L 86.6 127.961062 
" style="fill:none;stroke:#9467bd;stroke-linecap:square;stroke-width:1.5;"/>
    </g>
    <g id="line2d_31"/>
    <g id="text_23">
     <!-- SPY -->
     <g transform="translate(94.6 131.461062)scale(0.1 -0.1)">
      <defs>
       <path d="M 53.515625 70.515625 
L 53.515625 60.890625 
Q 47.90625 63.578125 42.921875 64.890625 
Q 37.9375 66.21875 33.296875 66.21875 
Q 25.25 66.21875 20.875 63.09375 
Q 16.5 59.96875 16.5 54.203125 
Q 16.5 49.359375 19.40625 46.890625 
Q 22.3125 44.4375 30.421875 42.921875 
L 36.375 41.703125 
Q 47.40625 39.59375 52.65625 34.296875 
Q 57.90625 29 57.90625 20.125 
Q 57.90625 9.515625 50.796875 4.046875 
Q 43.703125 -1.421875 29.984375 -1.421875 
Q 24.8125 -1.421875 18.96875 -0.25 
Q 13.140625 0.921875 6.890625 3.21875 
L 6.890625 13.375 
Q 12.890625 10.015625 18.65625 8.296875 
Q 24.421875 6.59375 29.984375 6.59375 
Q 38.421875 6.59375 43.015625 9.90625 
Q 47.609375 13.234375 47.609375 19.390625 
Q 47.609375 24.75 44.3125 27.78125 
Q 41.015625 30.8125 33.5 32.328125 
L 27.484375 33.5 
Q 16.453125 35.6875 11.515625 40.375 
Q 6.59375 45.0625 6.59375 53.421875 
Q 6.59375 63.09375 13.40625 68.65625 
Q 20.21875 74.21875 32.171875 74.21875 
Q 37.3125 74.21875 42.625 73.28125 
Q 47.953125 72.359375 53.515625 70.515625 
z
" id="DejaVuSans-83"/>
       <path d="M 19.671875 64.796875 
L 19.671875 37.40625 
L 32.078125 37.40625 
Q 38.96875 37.40625 42.71875 40.96875 
Q 46.484375 44.53125 46.484375 51.125 
Q 46.484375 57.671875 42.71875 61.234375 
Q 38.96875 64.796875 32.078125 64.796875 
z
M 9.8125 72.90625 
L 32.078125 72.90625 
Q 44.34375 72.90625 50.609375 67.359375 
Q 56.890625 61.8125 56.890625 51.125 
Q 56.890625 40.328125 50.609375 34.8125 
Q 44.34375 29.296875 32.078125 29.296875 
L 19.671875 29.296875 
L 19.671875 0 
L 9.8125 0 
z
" id="DejaVuSans-80"/>
       <path d="M -0.203125 72.90625 
L 10.40625 72.90625 
L 30.609375 42.921875 
L 50.6875 72.90625 
L 61.28125 72.90625 
L 35.5 34.71875 
L 35.5 0 
L 25.59375 0 
L 25.59375 34.71875 
z
" id="DejaVuSans-89"/>
      </defs>
      <use xlink:href="#DejaVuSans-83"/>
      <use x="63.476562" xlink:href="#DejaVuSans-80"/>
      <use x="121.529297" xlink:href="#DejaVuSans-89"/>
     </g>
    </g>
   </g>
  </g>
 </g>
 <defs>
  <clipPath id="pe9f9879c26">
   <rect height="235.008" width="357.12" x="57.6" y="41.472"/>
  </clipPath>
 </defs>
</svg>

## Now it is your turn

In this post we developed our dashboard to use market data from Yahoo Finance, styled our table and updated our chart. Now we can use this dashboard to track the relative performance of stocks, ETFs, currencies, etc easily. Now it is up to you! How can you improve this dashboard to suit your needs? For example, when we hover over our table, we lose the red/green colours we added in our styling. How could you change the code to prevent this from happening?

Our dashboard is useful, but it is a bit boring. It does not do anything, it just shows data. It would be nice if we could interact with it to display the data we want to see, not only a fixed set of symbols. That's excatly what we will be doing in part 3 of this Flask series. Stay tuned for the next episode!

:v:
