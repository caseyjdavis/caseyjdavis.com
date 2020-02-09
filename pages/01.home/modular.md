---
title: Home
modules_in_menu: true

content:
    items: '@self.modular'
    order:
        by: default
        dir: asc
        custom:
            - _intro
            - _about
            - _projects
            - _contact
            
form:
    name: contact-form
    action: /#contact-form
    inline-errors: true
    fields:
        - name: name
          label: Name
          placeholder: Enter your name
          autocomplete: on
          type: text
          validate:
            required: true

        - name: email
          label: Email
          placeholder: Enter your email address
          autocomplete: on
          type: email
          validate:
            required: true
            
        - name: msg
          label: Message
          placeholder: Enter your message
          type: textarea
          validate:
            required: true
        

    buttons:
        - type: submit
          value: Send Message

    process:
        - email:
            from: "{{ config.plugins.email.from }}"
            to: "{{ config.plugins.email.to }}"
            reply_to: "{{ form.value.email }}"
            subject: "[Contact] {{ form.value.name|e }}"
            body: "{% include 'forms/data.html.twig' %}"
        - save:
            fileprefix: contact-
            dateformat: Ymd-His-u
            extension: txt
            body: "{% include 'forms/data.txt.twig' %}"
        - message: Thank you for your message! I'll get back to you soon.
        - reset: true
        - redirect: "#contact-form"
---
