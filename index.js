const express = require('express');
const app = express();
const port = process.env.PORT || 10000;
app.use(express.json());
/**
 * Sample data
 */
// Sample JSON list of vehicles
let vehicles = [
    { "id": 1, "brand": "Toyota", "model": "Avanza", "year": 2022 },
    { "id": 2, "brand": "Honda", "model": "Brio", "year": 2021 },
    { "id": 3, "brand": "Daihatsu", "model": "Xenia", "year": 2022 },
    { "id": 4, "brand": "Suzuki", "model": "Ertiga", "year": 2023 },
    { "id": 5, "brand": "Mitsubishi", "model": "Xpander", "year": 2022 },
    { "id": 6, "brand": "Nissan", "model": "Livina", "year": 2021 },
    { "id": 7, "brand": "Isuzu", "model": "MUX", "year": 2023 },
    { "id": 8, "brand": "Toyota", "model": "Fortuner", "year": 2023 },
    { "id": 9, "brand": "Honda", "model": "CR-V", "year": 2022 },
    { "id": 10, "brand": "Suzuki", "model": "Jimny", "year": 2021 }
]


const checkHeaders = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    const platform = req.headers['x-platform'];
    const version = req.headers['x-version'];

    // we can change into authentication mode
    if (!apiKey || apiKey !== '123123') {
        return res.status(403).json({ status: 403, message: 'tidak diijinkan' });
    }

    if (!platform || (platform !== 'ios' && platform !== 'android')) {
        return res.status(401).json({ status: 401, message: 'hanya tersedia di aplikasi' });
    }

    if (!version || !/^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(version)) {
        return res.status(400).json({ status: 400, message: 'versi tidak valid' });
    }

    req.platform = platform;
    req.version = version;
    next();
};

app.use(checkHeaders);

app.get('/vehicles', (req, res) => {
    res.json({ status: 200, data: vehicles });
});

// Get a specific vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id, 10);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (vehicle) {
        res.json({ status: 200, data: vehicle });
    } else {
        res.status(404).json({ error: 'Vehicle not found' });
    }
});

app.get('/catalog-wheel', (req, res) => {
    if (req.platform === 'android' && req.version > '2.0.0') {
        res.json({ status: 200, message: 'Daftar katalog ban mobil' });
    } else {
        res.json({ status: 200, message: 'Hanya tersedia diaplikasi terbaru' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
