{% if page.termbase == "/crystaldown" %}
{% assign character = site.data.cd.characters[include.character] %}
{% elsif page.termbase == "/amauga" %}
{% assign character = site.data.amauga.characters[include.character] %}
{% elsif page.termbase == "/bug-fixing" %}
{% assign character = site.data.bug-fixing.characters[include.character] %}
{% endif %}

{:class="interface {{ include.class }}" style="order: 20"}
> Character Info
> {:onclick="toggleAccordion(this)" .inactive}
>
> |---------+--------------------------------------|
> |:--------|:-------------------------------------|
> | Name:   | {{ character.name }}                 |
> | Age:    | {{ character.age }}                  |
> | Race:   | {{ character.race | join: ' ' }}     |
>
> {:.interface}
> > Titles & Blessings
> > {:onclick="toggleAccordion(this)" .inactive}
> >
> > {% for title in character.titles %}
> > - {{ title.name }} {% if title.requirements %}({{ title.requirements | array_to_sentence_string }}){% endif %}{% endfor %}
> >
>
> {% unless include.titles_only %}{:.interface}
> > Traits
> > {:onclick="toggleAccordion(this)" .inactive}
> >
> > {% for trait in character.traits %}
> > - {{ trait.name }} ({{trait.type}}){% endfor %}
> >
>
> {:.interface}
> > Skills
> > {:onclick="toggleAccordion(this)" .inactive}
> >
> > {% for skill in character.skills %}
> > {:.interface}
> > > {{ skill.name }} {% if skill.level %} <span class="float-right">Level {% include ruby number=skill.level %}</span>{% endif %}
> > > {:onclick="toggleAccordion(this)" .inactive}
> > >
> > > {% for subskill in skill.subskills %}
> > > - {{ subskill.name }} <span class="float-right">Level {% include ruby number=subskill.level %}</span>{% endfor %}
> > >
> > {% endfor %}
> {% else %}⋮{% endunless %}
