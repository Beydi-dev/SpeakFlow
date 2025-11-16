"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabase_js_1 = require("@supabase/supabase-js");
const router = express_1.default.Router();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY // On utilise la service_role key pour bypass RLS
);
// POST /api/rooms/create
router.post('/create', async (req, res) => {
    try {
        const { nom, pin, userId } = req.body;
        // Validation
        if (!nom || !pin || !userId) {
            return res.status(400).json({ error: 'Champs manquants' });
        }
        // Hash du PIN
        const pinHash = await bcrypt_1.default.hash(pin, 10);
        // Insert dans Supabase
        const { data, error } = await supabase
            .from('salle')
            .insert({
            nom: nom,
            id_admin: userId,
            pin_hash: pinHash,
            active: true
        })
            .select()
            .single();
        if (error) {
            console.error('Erreur Supabase:', error);
            return res.status(500).json({ error: error.message });
        }
        res.json({ room: data });
    }
    catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST /api/rooms/verify-pin
router.post('/verify-pin', async (req, res) => {
    try {
        const { roomId, pin } = req.body;
        if (!roomId || !pin) {
            return res.status(400).json({ error: 'Champs manquants' });
        }
        // Recuprer le pin_hash depuis Supabase
        const { data: room, error } = await supabase
            .from('salle')
            .select('pin_hash')
            .eq('id', roomId)
            .single();
        if (error || !room) {
            return res.status(404).json({ error: 'Salle introuvable' });
        }
        // Comparer le PIN
        const isValid = await bcrypt_1.default.compare(pin, room.pin_hash);
        if (isValid) {
            res.json({ valid: true });
        }
        else {
            res.status(401).json({ valid: false, error: 'PIN incorrect' });
        }
    }
    catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
//# sourceMappingURL=rooms.js.map