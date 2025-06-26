"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../middleware/auth");
const userRepository_1 = require("../database/userRepository");
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=authentication_failed`);
        }
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email
        });
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
        res.redirect(redirectUrl);
    }
    catch (error) {
        console.error('Auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
});
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, secret);
        const user = await userRepository_1.UserRepository.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { ...userWithoutSensitive } = user;
        delete userWithoutSensitive.google_id;
        return res.json({ user: userWithoutSensitive });
    }
    catch (error) {
        console.error('Get current user error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        return res.json({ message: 'Logged out successfully' });
    });
});
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, secret);
        const user = await userRepository_1.UserRepository.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ valid: true, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        return res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map