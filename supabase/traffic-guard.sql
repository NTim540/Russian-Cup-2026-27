-- Retain the original authenticated HTTP command inside the database.
-- Skip empty network calls outside the sync function's date window.
DO $block$
DECLARE original text;
BEGIN
  SELECT command INTO original FROM cron.job WHERE jobname='russian-cup-fhr-live-sync';
  IF original IS NULL THEN RAISE EXCEPTION 'Sync job not found'; END IF;
  IF original LIKE '%cup_traffic_guard_v1%' THEN RETURN; END IF;
  PERFORM cron.alter_job((SELECT jobid FROM cron.job WHERE jobname='russian-cup-fhr-live-sync'), command :=
    'DO $guard$ BEGIN /* cup_traffic_guard_v1 */ IF EXISTS (SELECT 1 FROM public.cup_matches WHERE fhr_sync_enabled=true AND fhr_live_auto=true AND fhr_match_url IS NOT NULL AND game_date BETWEEN (now() AT TIME ZONE ''Europe/Moscow'')::date-1 AND (now() AT TIME ZONE ''Europe/Moscow'')::date+1) THEN EXECUTE '
    || quote_literal(original) || '; END IF; END $guard$;');
END $block$;
