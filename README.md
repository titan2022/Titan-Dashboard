# Titan-Dashboard
Titan Robotics #2022 repository for custom dashboard

## Running

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run start
```

### Skia shader compilation error

If you ever get this error:

```
[605899:0302/094658.158225:ERROR:shared_context_state.cc(81)] Skia shader compilation error
```

run:

```bash
rm -rf ~/.config/titan-dashboard
```
