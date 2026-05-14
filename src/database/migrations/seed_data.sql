INSERT INTO roles (role_name, description) VALUES 
    ('admin', 'Administrador del sistema'),
    ('doctor', 'Doctor del sistema'),
    ('patient', 'Paciente del sistema'),
    ('nurse', 'Enfermero del sistema')
ON CONFLICT (role_name) DO NOTHING;


INSERT INTO users (email, password, name, is_active)
VALUES ('admin@example.com', '$2b$10$RUBsio4/rXHVbiBDOQm7vefotx1a.BWXDh/vbi47limnA0YHwrRtq', 'Admin User', true)
ON CONFLICT (email) DO NOTHING;


INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' 
AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;
