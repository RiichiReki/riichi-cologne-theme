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
</table>

<h2>Seating and Detailed Scores</h2>

<table class="data-table">
  <thead><tr>
    <th>R.</th>
    <th>T.</th>
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
        {% assign player_data = tournament.scores | where: 'player_id', pid | last %}
{%comment%}
        <td{% if pid == page.player_id %} style="font-weight:bold"{%endif%}>
          {{ pid }}
        </td>
{%endcomment%}
        <td{% if pid == page.player_id %} style="font-weight:bold"{%endif%}>
          {{ player_data.surname }}, {{ player_data.name }}
        </td>
        <td{% if page.player_id == pid %} style="font-weight:bold"{%endif%}>
          {{ player_data.[rid] }}
        </td>
      {% endfor %}
   </tr>
{% endfor %}
  </tbody>
</table>
