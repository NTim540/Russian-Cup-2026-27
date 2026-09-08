-- Public image reads only. Uploads go through authenticated team-admin.
-- No anonymous/authenticated INSERT, UPDATE or DELETE policies are added.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('team-city-images','team-city-images',true,5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
