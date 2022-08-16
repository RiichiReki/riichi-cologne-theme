{% assign tables_1 = tournament.seating | where: 's1', page.player_id %}
{% assign tables_2 = tournament.seating | where: 's2', page.player_id %}
{% assign tables_3 = tournament.seating | where: 's3', page.player_id %}
{% assign tables_4 = tournament.seating | where: 's4', page.player_id %}

{% assign tables = [] %}
{% if tables_1 %}{% assign tables = tables | concat: tables_1 %}{% endif %}
{% if tables_2 %}{% assign tables = tables | concat: tables_2 %}{% endif %}
{% if tables_3 %}{% assign tables = tables | concat: tables_3 %}{% endif %}
{% if tables_4 %}{% assign tables = tables | concat: tables_4 %}{% endif %}
{% assign tables = tables | sort: 'round' %}

{% assign player_data = tournament.scores | where: 'player_id', page.player_id | last %}

<table>
 <tr>
    <td>Name:</td>
    <td>{{ player_data.surname }}, {{ player_data.name }}</td>
  </tr>
  <tr>
    <td>EMA Number:</td>
    <td>{{player_data.ema_id}}</td>
  </tr>
  <tr>
    <td>Current Score:</td>
    <td>{{ player_data.total }}</td>
  </tr>
  <tr>
    <td>Current Rank:</td>
    <td>{{ player_data.rank }} of {{ tournament.parameters.players }}</td>
  </tr>
</table>

<h2>Seating and Detailed Scores</h2>

<table class="data-table-plain d-md-none">
  <thead><tr>
    <th>Round</th>
    <th>Table</th>
    <th>Name</th> 
    <th>Score</th>
  </tr></thead>
  <tbody>
{% for round in (1..tournament.parameters.rounds) %}
  {% assign round_index = round | plus: -1 %}
  {% assign rid = "r" | append: round %}
  {% capture players_string%}{{ tables[round_index].s1 }},{{ tables[round_index].s2 }},{{ tables[round_index].s3 }},{{ tables[round_index].s4 }}{% endcapture %}
  {% assign players = players_string | split: ',' %}
      {% for pid in players %}
      <tr>
      <td>{{ round }}</td>
      <td>{{ tables[round_index].table }}</td>
        {% assign player_data = tournament.scores | where: 'player_id', pid | last %}
        {% if pid == page.player_id %}
          <td style="font-weight:bold">
        {% else %}
          <td><a href="../{{ pid | prepend: '00' | slice: -2, 2 }}/">
        {% endif %}
          {% if player_data.surname %}{{ player_data.surname }}, {{ player_data.name }}{% else %}Player {{ pid }}{%endif%}
        {% unless pid == page.player_id %}</a>{% endunless %}
          </td>
        <td{% if page.player_id == pid %} style="font-weight:bold"{%endif%}>
          {{ player_data.[rid] }}
        </td>
      </tr>
  {% endfor %}
{% endfor %}
  </tbody>
</table>

<table class="data-table-plain d-none d-md-table d-lg-none my-4">
  <thead><tr>
    <th>Round</th>
    <th>Table</th>
    <th>Name</th>
    <th>Score</th>
    <th>Name</th>
    <th>Score</th>
  </tr></thead>
  <tbody>
{% for round in (1..tournament.parameters.rounds) %}
  {% assign round_index = round | plus: -1 %}
  {% assign rid = "r" | append: round %}
  {% capture players_string%}{{ tables[round_index].s1 }},{{ tables[round_index].s2 }},{{ tables[round_index].s3 }},{{ tables[round_index].s4 }}{% endcapture %}
  {% assign players = players_string | split: ',' %}
   <tr>
      <td>{{ round }}</td>
      <td>{{ tables[round_index].table }}</td>
      {% for pid in players %}
        {% assign player_data = tournament.scores | where: 'player_id', pid | last %}{% if pid == page.player_id %}
          <td style="font-weight:bold">
        {% else %}
          <td><a href="../{{ pid | prepend: '00' | slice: -2, 2 }}/">
        {% endif %}
          {% if player_data.surname %}{{ player_data.surname }}, {{ player_data.name }}{% else %}Player {{ pid }}{%endif%}
        {% unless pid == page.player_id %}</a>{% endunless %}
          </td>
        <td{% if page.player_id == pid %} style="font-weight:bold"{%endif%}>
          {{ player_data.[rid] }}
        </td>
        {% if forloop.index == 2 %}
          </tr>
          <tr>
            <td>{{ round }}</td>
            <td>{{ tables[round_index].table }}</td>
        {% endif %}
      {% endfor %}
   </tr>
{% endfor %}
  </tbody>
</table>

<table class="data-table-plain d-none d-lg-table my-4">
  <thead><tr>
    <th>Round</th>
    <th>Table</th>
    <th>Name</th>
    <th>Score</th>
    <th>Name</th>
    <th>Score</th>
    <th>Name</th>
    <th>Score</th>
    <th>Name</th>
    <th>Score</th>
  </tr></thead>
  <tbody>
{% for round in (1..tournament.parameters.rounds) %}
  {% assign round_index = round | plus: -1 %}
  {% assign rid = "r" | append: round %}
  {% capture players_string%}{{ tables[round_index].s1 }},{{ tables[round_index].s2 }},{{ tables[round_index].s3 }},{{ tables[round_index].s4 }}{% endcapture %}
  {% assign players = players_string | split: ',' %}
   <tr>
      <td>{{ round }}</td>
      <td>{{ tables[round_index].table }}</td>
      {% for pid in players %}
        {% assign player_data = tournament.scores | where: 'player_id', pid | last %}{% if pid == page.player_id %}
          <td style="font-weight:bold">
        {% else %}
          <td><a href="../{{ pid | prepend: '00' | slice: -2, 2 }}/">
        {% endif %}
          {% if player_data.surname %}{{ player_data.surname }}, {{ player_data.name }}{% else %}Player {{ pid }}{%endif%}
        {% unless pid == page.player_id %}</a>{% endunless %}
          </td>
        <td{% if page.player_id == pid %} style="font-weight:bold"{%endif%}>
          {{ player_data.[rid] }}
        </td>
      {% endfor %}
   </tr>
{% endfor %}
  </tbody>
</table>

[Back to the Tournament Page](../..)
