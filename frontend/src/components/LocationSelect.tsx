import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { type SingleValue } from 'react-select';
import { Label } from '@/components/ui/label';

export interface LocationOption {
    value: string;
    label: string;
}

interface LocationSelectProps {
    selectedLocationOption: LocationOption | null;
    setSelectedLocationOption: (option: LocationOption | null) => void;
    setLocation: (location: string) => void;
    setLocationChosen: (chosen: boolean) => void;
    locationChosen: boolean;
    locationError: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    selectedLocationOption,
    setSelectedLocationOption,
    setLocation,
    setLocationChosen,
    locationChosen,
    locationError
}) => {
    // Load city options from Photon API (free, no API key needed)
    const loadOptions = async (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) {
            return { options: [] };
        }

        try {
            // Using Photon API - free geocoding API based on OpenStreetMap
            // Using osm_tag to filter for cities and populated places
            const response = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(inputValue)}&limit=15&osm_tag=place:city&osm_tag=place:town`
            );

            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                return { options: [] };
            }

            // Filter and format city results
            const options = data.features
                .filter((feature: any) => {
                    // Get city name from various possible properties
                    const cityName = feature.properties.city || feature.properties.name;
                    if (!cityName) return false;

                    // Check if the input matches the city name (case insensitive, partial match)
                    const searchTerm = inputValue.toLowerCase().trim();
                    return cityName.toLowerCase().includes(searchTerm);
                })
                .map((feature: any) => {
                    const city = feature.properties.city || feature.properties.name;
                    const state = feature.properties.state || '';
                    const country = feature.properties.country || '';

                    // Format: "City, State" for US or "City, Country" for others
                    const label = state
                        ? `${city}, ${state}`
                        : `${city}, ${country}`;

                    return {
                        value: label,
                        label: label
                    };
                })
                // Remove duplicates
                .filter((option: LocationOption, index: number, self: LocationOption[]) =>
                    index === self.findIndex((o) => o.value === option.value)
                )
                // Sort by relevance - exact matches first
                .sort((a: LocationOption, b: LocationOption) => {
                    const searchTerm = inputValue.toLowerCase().trim();
                    const aCity = a.label.split(',')[0].toLowerCase();
                    const bCity = b.label.split(',')[0].toLowerCase();

                    // Exact match comes first
                    if (aCity === searchTerm) return -1;
                    if (bCity === searchTerm) return 1;

                    // Starts with search term comes next
                    if (aCity.startsWith(searchTerm) && !bCity.startsWith(searchTerm)) return -1;
                    if (bCity.startsWith(searchTerm) && !aCity.startsWith(searchTerm)) return 1;

                    return 0;
                });
            return { options };
        } catch (error) {
            console.error('Error fetching cities:', error);
            return { options: [] };
        }
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="hangout-location" className="text-lg font-semibold mb-2">
                Location
            </Label>
            {/* Location Dropdown*/}
            <div className="flex-1 space-y-8 max-w-sm">
                <AsyncPaginate
                    value={selectedLocationOption}
                    loadOptions={loadOptions}
                    onChange={(selected: SingleValue<LocationOption>) => {
                        setSelectedLocationOption(selected);
                        setLocation(selected?.value || '');
                        setLocationChosen(true);
                    }}
                    placeholder="Type to search for a city..."
                    isClearable
                    debounceTimeout={300}
                    additional={{
                        page: 1
                    }}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: !locationChosen ? '#ef4444' : 'hsl(var(--border))',
                            backgroundColor: 'white',
                            '&:hover': {
                                borderColor: !locationChosen ? '#ef4444' : 'hsl(var(--border))'
                            }
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: 'white'
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                            color: '#000'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: '#000'
                        }),
                        input: (base) => ({
                            ...base,
                            color: '#000'
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: '#9ca3af'
                        })
                    }}
                />
            </div>
            {!locationChosen && <p className="text-red-500 text-sm">{locationError}</p>}
        </div>
    );
};

export default LocationSelect;
