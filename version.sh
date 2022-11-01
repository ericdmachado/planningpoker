PACKAGE_FILE="./frontend/package.json";

#Reference
increment_version ()
{
  declare -a part=( ${1//\./ } )
  declare    new
  declare -i carry=1

  for (( CNTR=${#part[@]}-1; CNTR>=0; CNTR-=1 )); do
    len=${#part[CNTR]}
    new=$((part[CNTR]+carry))
    [ ${#new} -gt $len ] && carry=1 || carry=0
    [ $CNTR -gt 0 ] && part[CNTR]=${new: -len} || part[CNTR]=${new}
  done
  new="${part[*]}"
  echo -e "${new// /.}"
} 

read_var() {
  VAR=$(grep $1 $2 | xargs)
  IFS=": " read -ra VAR <<< "$VAR"
  echo ${VAR[1]//,/}
}

VERSION=$(read_var version $PACKAGE_FILE);
NEW_VERSION=$(increment_version $VERSION);

sed -i "s/version\": \"$VERSION/version\": \"$NEW_VERSION/gi" $PACKAGE_FILE