/*
# Create transport bookings (single-tenant, no sign-in)

1. New Tables
- `transport_bookings`
- `id` (uuid, primary key)
- `vehicle_type` (text, selected ambulance or standard car)
- `pickup_location` (text, requested pickup address)
- `destination` (text, requested destination address)
- `travel_date` (date, requested date)
- `travel_time` (time, requested time)
- `special_notes` (text, optional accessibility or care notes)
- `estimated_total` (integer, estimated fare in Indonesian rupiah)
- `created_at` (timestamp, submission time)

2. Security
- Row level security is enabled.
- The no-sign-in app can create and read its shared booking confirmations with the anon key.
- Update and delete policies are included as separate CRUD policies for the single-tenant app.

3. Important Notes
- This table intentionally does not include a user account reference because the supplied experience has no sign-in flow.
- Booking input is validated in the browser before insertion.
*/

CREATE TABLE IF NOT EXISTS transport_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('ambulance', 'car')),
  pickup_location text NOT NULL,
  destination text NOT NULL,
  travel_date date NOT NULL,
  travel_time time NOT NULL,
  special_notes text,
  estimated_total integer NOT NULL DEFAULT 0 CHECK (estimated_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transport_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read transport bookings" ON transport_bookings;
CREATE POLICY "Public can read transport bookings" ON transport_bookings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can create transport bookings" ON transport_bookings;
CREATE POLICY "Public can create transport bookings" ON transport_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update transport bookings" ON transport_bookings;
CREATE POLICY "Public can update transport bookings" ON transport_bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete transport bookings" ON transport_bookings;
CREATE POLICY "Public can delete transport bookings" ON transport_bookings FOR DELETE TO anon, authenticated USING (true);