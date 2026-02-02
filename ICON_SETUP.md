# Icon Setup Guide for Live2Share

## Using the Provided Icon

The Live2Share app icon has been attached. To properly set it up across all platforms:

### Web Platform (Done)
The web assets are in `web/icons/` and `web/favicon.png`

### Android Platform
1. Place `icon.png` in: `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
2. For other densities, create appropriately sized versions in:
   - `mipmap-mdpi/ic_launcher.png` (48x48)
   - `mipmap-xhdpi/ic_launcher.png` (96x96)
   - `mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### iOS Platform
1. Open `ios/Runner/Assets.xcassets` in Xcode
2. Create an AppIcon set if not already present
3. Drag the icon to all sizes (1024x1024 for App Store, scale down as needed)

### Windows Platform
1. Place icon in: `windows/runner/resources/app_icon.ico`
2. Update icon in `windows/runner/main.cpp` if needed

### macOS Platform
1. Place icon in: `macos/Runner/Assets.xcassets/AppIcon.appiconset/`
2. Use AppIcon set in Xcode to configure all required sizes

## Using flutter_launcher_icons Package (Optional)

For automated icon generation, you can use the `flutter_launcher_icons` package:

1. Add to `pubspec.yaml`:
```yaml
dev_dependencies:
  flutter_launcher_icons: "^0.13.1"
```

2. Create `pubspec.yaml` configuration:
```yaml
flutter_icons:
  android: true
  ios: true
  windows: true
  macos: true
  web:
    generate: true
    image_path: "assets/logo.png"
    background_color: "#0175C2"
    theme_color: "#0175C2"
  image_path: "assets/logo.png"
  adaptive_icon_background: "#ffffff"
  adaptive_icon_foreground: "assets/logo.png"
```

3. Run:
```bash
flutter pub get
flutter pub run flutter_launcher_icons
```

## Branding Colors

The Live2Share app uses these colors:
- Primary: `#2563EB` (Blue)
- Secondary: `#7C3AED` (Purple)
- Background: `#0175C2` (Web theme)

These colors should be incorporated into the app icon design for consistency.

## Current Icon Status

✅ App name updated to "Live2Share" across all platforms
✅ Web manifest and HTML updated
✅ Ready for custom icon integration

Once you have the icon in the required formats, place them in their respective directories as outlined above.
