#!/bin/bash

APP_NAME="WarehouseApp"
APP_ID="com.example.warehouseapp"

echo "🚀 安装 Capacitor..."
npm install @capacitor/core @capacitor/cli --save
npx cap init "$APP_NAME" "$APP_ID" --web-dir=build --npm-client npm

echo "📦 构建 React 项目..."
npm run build

echo "➕ 添加 Android 平台..."
npx cap add android

echo "📁 拷贝构建内容到原生工程..."
npx cap copy

echo "✅ 打开 Android Studio（可选）"
npx cap open android
