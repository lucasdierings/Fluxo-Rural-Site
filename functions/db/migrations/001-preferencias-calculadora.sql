-- Preferências separadas do consentimento necessário ao funcionamento.
-- A calculadora pode processar o diagnóstico sem inscrever a pessoa em conteúdos.
ALTER TABLE calculadora_diagnosticos ADD COLUMN avisar_media_cidade INTEGER NOT NULL DEFAULT 0;
ALTER TABLE calculadora_diagnosticos ADD COLUMN consent_conteudos INTEGER NOT NULL DEFAULT 0;
