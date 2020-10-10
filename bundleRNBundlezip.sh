#自动化打包脚本
echo '====================================RN bundle自动化打包脚本===================================='
echo "使用介绍："
echo "输入基础包版本号"
echo "输入业务包名（默认为aboutus），和版本号"
echo "然后等待打包完成即可，生成的产物有react-native打包后生产的文件夹，zip压缩有的文件夹"

echo "==================请输入common包版本号 ,如 1.0:"
read -p "" commonVersion
#基础包名
commonName=common
if [ ! -n "$commonVersion" ] ;then
  commonVersion=1.0
  echo "默认common包名:$commonName,版本号: $commonVersion"
else
  echo "common包名:$commonName,common包版本号: $commonVersion"
fi

echo "==================请输入业务包名,如 aboutus:"
read -p "" subName 
if [ ! -n "$subName" ] ;then
  subName=Github_RN
  echo "默认业务包名: $subName"
else
  echo "业务包名: $subName"
fi

echo "==================请输入业务包版本号,如 1.0:"
read -p "" subVersion 

if [ ! -n "$subVersion" ] ;then
  subVersion=1.0
  echo "默认业务包版本号: $subVersion"
else
  echo "业务包版本号: $subVersion"
fi

# 压缩文件
zip_file(){
echo "压缩文件路径 ${1}"
echo "压缩文件 ${2}"
cd $1
zipFile="../${2}.zip"
echo "压缩文件zipFile= ${zipFile}"
zip -r $zipFile ./
cd ../../../
}

# echo '开始打包'
bundleOutput(){
#平台
platform=$1
#模块
module=$2
#版本号
version=$3

echo "打包配置: platform:${bundlePath},module:${module},version:${version}"

bundlePath="metro/${version}/${module}_${version}_${platform}/${module}_${version}_${platform}.bundle"
resPath="metro/${version}/${module}_${version}_${platform}"
folderName="${module}_${version}_${platform}"

echo "bundlePath:${bundlePath}"
echo "resPath:${resPath}"

echo '生成产物文件夹'
mkdir -p $resPath

echo '============开始打包============'

if [ $module == 'common' ]
then
echo '打包基础包:'
react-native bundle --platform $platform --dev false --entry-file ./index.js --bundle-output $bundlePath --assets-dest $resPath --config ./metroCommon.config.js
else
echo '打包业务包:'
react-native bundle --platform $platform --dev false --entry-file ./index.js --bundle-output $bundlePath --assets-dest $resPath --config ./metroSub.config.js
fi

echo '============打包完成============'
echo '当前文件夹路径'
echo "============开始压缩${resPath}"
zip_file $resPath $folderName
}

#编译所有的bundle
buildAllBundle(){
echo '编译所有的bundle'
bundleOutput "android" $commonName $commonVersion
bundleOutput "android" $subName $subVersion
bundleOutput "ios" $commonName $commonVersion
bundleOutput "ios" $subName $subVersion
}

#编译业务bundle
buildSubBundle(){
echo '编译业务bundle'
bundleOutput "android" $subName $subVersion
bundleOutput "ios" $subName $subVersion
}

echo -e "==================请输入打包方式（默认全量）:\n1:全量打包 \n2:只打业务包"
read -p "" buildType
if [ ! -n "$buildType" ] ;then
  buildType=3
  echo "当前打包方式:$buildType"
else
  echo "当前打包方式:$buildType"
fi
#判断
if(($buildType==1));then
buildAllBundle
elif(($buildType==2));then
buildSubBundle
else
echo "打包结束"
fi