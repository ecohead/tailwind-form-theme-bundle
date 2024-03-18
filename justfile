# Variables
EXEC := "docker compose exec php"
COMPOSER := EXEC + " composer"
SYMFONY := EXEC + " symfony"
NODE := EXEC + " node"

# Aliases
composer +arguments:
  COMPOSER_ALLOW_SUPERUSER=1 {{COMPOSER}} {{arguments}}

console +arguments:
  {{SYMFONY}} console {{arguments}}

npm +arguments:
  {{EXEC}} bash -c "cd assets && npm {{arguments}}"

cc env='dev':
  {{SYMFONY}} console cache:clear --env={{env}}

test:
  {{EXEC}} php bin/phpunit
