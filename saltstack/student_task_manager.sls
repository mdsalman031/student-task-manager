nginx:
  pkg.installed: []

nginx-service:
  service.running:
    - name: nginx
    - enable: true
    - require:
      - pkg: nginx
