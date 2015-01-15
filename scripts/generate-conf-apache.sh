#!/usr/bin/env bash

APACHE_CONF="/etc/apache2/httpd.conf"

PUTAINDETAB_APACHE_CONF=$PUTAINDETAB_PATH/index.apache.conf
echo "Updating configuring for Apache in $PUTAINDETAB_APACHE_CONF..."

sudo -v

echo "# putaindetab $PUTAINDETAB_PATH
Alias /tab \"$PUTAINDETAB_PATH\"
<Directory \"$PUTAINDETAB_PATH\">
  Options Indexes FollowSymLinks MultiViews
  AllowOverride All
  Require all granted
</Directory>
"| sudo tee "$PUTAINDETAB_APACHE_CONF"

# Add Apache configuration only if not already here
if cat $APACHE_CONF | grep "$PUTAINDETAB_PATH" > /dev/null
then
  echo "Apache configuration already included"
else
  echo "Including configuring to Apache..."
  echo "" | sudo tee -a $APACHE_CONF
  echo "# putaindetab $PUTAINDETAB_PATH" | sudo tee -a $APACHE_CONF
  echo "Include \"$PUTAINDETAB_APACHE_CONF\"" | sudo tee -a $APACHE_CONF
fi

# restart Apache
if type apachectl > /dev/null
then
  echo "Restarting Apache..."
  apachectl configtest
  sudo apachectl restart
else
  echo "Please restart Apache"
fi
