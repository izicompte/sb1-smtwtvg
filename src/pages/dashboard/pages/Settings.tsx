import {LogoUploader} from "../components/LogoUploader"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { settingsService } from '../../../services/settings/settings.service';
import { RestaurantSettings } from '../../../types';

const days = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];

export function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, isDirty } } = useForm<RestaurantSettings>();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await settingsService.getSettings();
      if (settings) {
        Object.entries(settings).forEach(([key, value]) => {
          setValue(key as keyof RestaurantSettings, value);
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres :', error);
      toast.error('Impossible de charger les paramètres.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RestaurantSettings) => {
    try {
      await settingsService.updateSettings(data);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      toast.error('Impossible de sauvegarder les paramètres.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeLanding = watch('activeLanding');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-10 px-4 py-8"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paramètres du Restaurant</h2>
        </div>

        {/* Informations générales */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Informations Générales</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Nom du Restaurant
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="Ex: Le Gourmet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Image de Logo (URL)
              </label>
              <input
                type="text"
                {...register('logo', { required: false })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description', { required: true })}
                rows={3}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="Décrivez brièvement votre établissement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Image de Couverture (URL)
              </label>
              <input
                type="text"
                {...register('coverImage', { required: true })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Devise Monétaire
              </label>
              <select
                {...register('currency')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="XOF">XOF (FCFA)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Contact & Emplacement */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact & Emplacement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Adresse
              </label>
              <input
                type="text"
                {...register('address', { required: true })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="Ex: 123 Rue du Gourmet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Numéro de Téléphone
              </label>
              <input
                type="text"
                {...register('phone', { required: true })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
        </section>

        {/* Apparence / Landing Page */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Page d'Accueil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                Modèle de Landing Page
              </label>
              <select
                {...register('activeLanding')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              >
                <option value="modern">Moderne</option>
                <option value="minimal">Minimaliste</option>
                <option value="grid">Grille</option>

              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choisissez le style visuel de votre page d'accueil.
              </p>
            </div>

            {activeLanding === 'fast-food' && (
              <div className="space-y-4 border-t dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Élément Vedette</h3>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                    Nom de l'Élément Vedette
                  </label>
                  <input
                    type="text"
                    {...register('featuredItem.name')}
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                    placeholder="Ex: Burger Spécial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                    Description de l'Élément Vedette
                  </label>
                  <textarea
                    {...register('featuredItem.description')}
                    rows={2}
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                    placeholder="Décrivez votre plat vedette"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                    Image de l'Élément Vedette (URL)
                  </label>
                  <input
                    type="text"
                    {...register('featuredItem.image')}
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                    placeholder="https://example.com/plat.jpg"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Horaires d'Ouverture */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Horaires d'Ouverture</h2>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <span className="w-32 capitalize text-gray-800 dark:text-gray-300">{day}</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`openingHours.${day}.closed` as const)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-gray-800 dark:text-gray-300">Fermé</span>
                </label>
                {!watch(`openingHours.${day}.closed`) && (
                  <>
                    <input
                      type="time"
                      {...register(`openingHours.${day}.open` as const)}
                      className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                    <span className="text-gray-800 dark:text-gray-300">à</span>
                    <input
                      type="time"
                      {...register(`openingHours.${day}.close` as const)}
                      className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Aperçu */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Aperçu</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-8">
          Voici comment les informations pourraient apparaître sur la page d'accueil.
        </p>

        <div className="space-y-4">
          <InfoCard
            title="Horaires d'Ouverture"
            description={
              watch('openingHours.monday') && !watch('openingHours.monday.closed')
                ? `${watch('openingHours.monday.open') || '11:00'} - ${watch('openingHours.monday.close') || '22:00'}`
                : "Fermé le Lundi"
            }
          />
          <InfoCard
            title="Emplacement"
            description={watch('address') || "123 Rue du Gourmet"}
          />
          <InfoCard
            title="Contact"
            description={watch('phone') || "Appelez-nous pour réserver"}
          />
        </div>
      </section>
    </motion.div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-700/30 border dark:border-gray-600 rounded-lg p-4 text-gray-800 dark:text-gray-100 flex flex-col space-y-2 transition-colors"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );
}
