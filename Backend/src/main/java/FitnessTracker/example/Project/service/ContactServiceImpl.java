package FitnessTracker.example.Project.service;

import FitnessTracker.example.Project.entity.Contact;
import FitnessTracker.example.Project.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repo;

    public ContactServiceImpl(ContactRepository repo) {
        this.repo = repo;
    }

    @Override
    public Contact save(Contact contact) {
        return repo.save(contact);
    }

    @Override
    public List<Contact> getAll() {
        return repo.findAll();
    }

    @Override
    public Contact getById(String id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Contact update(String id, Contact updated) {
        Contact c = getById(id);

        c.setName(updated.getName());
        c.setEmail(updated.getEmail());
        c.setPhoneNumber(updated.getPhoneNumber());
        c.setAddress(updated.getAddress());
        c.setDescription(updated.getDescription());
        c.setWebsiteLink(updated.getWebsiteLink());
        c.setLinkedInLink(updated.getLinkedInLink());
        c.setFavorite(updated.getFavorite());
        c.setPinned(updated.getPinned());
        c.setArchived(updated.getArchived());

        return repo.save(c);
    }

    @Override
    public void delete(String id) {
        repo.deleteById(id);
    }

    @Override
    public List<Contact> getArchived() {
        return repo.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getArchived()))
                .toList();
    }

    @Override
    public List<Contact> getActive() {
        return repo.findAll().stream()
                .filter(c -> !Boolean.TRUE.equals(c.getArchived()))
                .toList();
    }
}